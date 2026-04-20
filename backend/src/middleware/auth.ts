import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { AppError } from "./errorHandler";
import prisma from "../config/database";

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError("Authentication required", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, config.jwt.secret) as {
      userId: string;
      role: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      throw new AppError("User not found or inactive", 401);
    }

    req.userId = user.id;
    req.userRole = user.role;
    next();
  } catch (error) {
    if (error instanceof AppError) return next(error);
    next(new AppError("Invalid or expired token", 401));
  }
};

export const requireAdmin = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  if (req.userRole !== "ADMIN") {
    return next(new AppError("Admin access required", 403));
  }
  next();
};
