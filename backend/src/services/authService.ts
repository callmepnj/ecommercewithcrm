import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { config } from "../config";
import { userRepository } from "../repositories/userRepository";
import { AppError } from "../middleware/errorHandler";

export class AuthService {
  async register(data: {
    name: string;
    phone: string;
    email?: string;
    password?: string;
  }) {
    const existing = await userRepository.findByPhone(data.phone);
    if (existing) {
      throw new AppError("Phone number already registered", 409);
    }

    if (data.email) {
      const emailExists = await userRepository.findByEmail(data.email);
      if (emailExists) {
        throw new AppError("Email already registered", 409);
      }
    }

    const passwordHash = data.password
      ? await bcrypt.hash(data.password, 12)
      : undefined;

    const user = await userRepository.create({
      name: data.name,
      phone: data.phone,
      email: data.email,
      passwordHash,
    });

    const tokens = this.generateTokens(user.id, user.role);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      user: { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role },
      ...tokens,
    };
  }

  async loginWithPassword(phone: string, password: string) {
    const user = await userRepository.findByPhone(phone);
    if (!user || !user.passwordHash) {
      throw new AppError("Invalid credentials", 401);
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new AppError("Invalid credentials", 401);
    }

    if (!user.isActive) {
      throw new AppError("Account is deactivated", 403);
    }

    const tokens = this.generateTokens(user.id, user.role);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      user: { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role },
      ...tokens,
    };
  }

  async requestOtp(phone: string, type: "LOGIN" | "REGISTER" | "RESET_PASSWORD") {
    let user = await userRepository.findByPhone(phone);

    if (type === "LOGIN" && !user) {
      throw new AppError("Phone number not registered", 404);
    }

    if (!user && type === "REGISTER") {
      // Will be created after OTP verification
      return { message: "OTP sent successfully" };
    }

    if (user) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      await userRepository.saveOtp(user.id, code, type);
      // In production, send SMS via Twilio/MSG91
      console.log(`[DEV] OTP for ${phone}: ${code}`);
    }

    return { message: "OTP sent successfully" };
  }

  async verifyOtpAndLogin(phone: string, otp: string) {
    const user = await userRepository.findByPhone(phone);
    if (!user) {
      throw new AppError("Phone number not registered", 404);
    }

    const verified = await userRepository.verifyOtp(user.id, otp);
    if (!verified) {
      throw new AppError("Invalid or expired OTP", 400);
    }

    if (!user.phoneVerified) {
      await userRepository.update(user.id, { phoneVerified: true });
    }

    const tokens = this.generateTokens(user.id, user.role);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      user: { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role },
      ...tokens,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    const stored = await userRepository.findRefreshToken(refreshToken);
    if (!stored || stored.expiresAt < new Date()) {
      throw new AppError("Invalid refresh token", 401);
    }

    // Rotate refresh token
    await userRepository.deleteRefreshToken(refreshToken);

    const tokens = this.generateTokens(stored.user.id, stored.user.role);
    await this.saveRefreshToken(stored.user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(refreshToken: string) {
    try {
      await userRepository.deleteRefreshToken(refreshToken);
    } catch {
      // Token might already be deleted
    }
  }

  private generateTokens(userId: string, role: string) {
    const accessToken = jwt.sign({ userId, role }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    } as jwt.SignOptions);

    const refreshToken = jwt.sign(
      { userId, type: "refresh" },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn } as jwt.SignOptions
    );

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: string, token: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await userRepository.saveRefreshToken(userId, token, expiresAt);
  }
}

export const authService = new AuthService();
