import prisma from "../config/database";

export class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatar: true,
        language: true,
        createdAt: true,
      },
    });
  }

  async findByPhone(phone: string) {
    return prisma.user.findUnique({ where: { phone } });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(data: {
    name: string;
    phone: string;
    email?: string;
    passwordHash?: string;
  }) {
    return prisma.user.create({ data });
  }

  async update(id: string, data: Record<string, unknown>) {
    return prisma.user.update({ where: { id }, data });
  }

  async saveRefreshToken(userId: string, token: string, expiresAt: Date) {
    return prisma.refreshToken.create({
      data: { token, userId, expiresAt },
    });
  }

  async findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  async deleteRefreshToken(token: string) {
    return prisma.refreshToken.delete({ where: { token } });
  }

  async saveOtp(userId: string, code: string, type: "LOGIN" | "REGISTER" | "RESET_PASSWORD") {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    return prisma.otpCode.create({
      data: { code, userId, type, expiresAt },
    });
  }

  async verifyOtp(userId: string, code: string) {
    const otp = await prisma.otpCode.findFirst({
      where: {
        userId,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (otp) {
      await prisma.otpCode.update({
        where: { id: otp.id },
        data: { used: true },
      });
    }

    return otp;
  }
}

export const userRepository = new UserRepository();
