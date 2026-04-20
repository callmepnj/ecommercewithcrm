import { Request, Response, NextFunction } from "express";
import { authService } from "../services/authService";
import { userRepository } from "../repositories/userRepository";
import { AuthRequest } from "../middleware/auth";

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone, password, otp } = req.body;

      let result;
      if (otp) {
        result = await authService.verifyOtpAndLogin(phone, otp);
      } else if (password) {
        result = await authService.loginWithPassword(phone, password);
      } else {
        return res.status(400).json({
          success: false,
          message: "Password or OTP required",
        });
      }

      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async requestOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.requestOtp(req.body.phone, req.body.type);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const tokens = await authService.refreshAccessToken(refreshToken);
      res.json({ success: true, data: tokens });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      await authService.logout(refreshToken);
      res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await userRepository.findById(req.userId!);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await userRepository.update(req.userId!, req.body);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
