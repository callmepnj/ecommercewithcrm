import { Response, NextFunction } from "express";
import prisma from "../config/database";
import { AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";

export class AddressController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const addresses = await prisma.address.findMany({
        where: { userId: req.userId! },
        orderBy: { isDefault: "desc" },
      });
      res.json({ success: true, data: addresses });
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (req.body.isDefault) {
        await prisma.address.updateMany({
          where: { userId: req.userId!, isDefault: true },
          data: { isDefault: false },
        });
      }

      const address = await prisma.address.create({
        data: { ...req.body, userId: req.userId! },
      });
      res.status(201).json({ success: true, data: address });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const address = await prisma.address.findFirst({
        where: { id: req.params.id, userId: req.userId! },
      });
      if (!address) throw new AppError("Address not found", 404);

      if (req.body.isDefault) {
        await prisma.address.updateMany({
          where: { userId: req.userId!, isDefault: true },
          data: { isDefault: false },
        });
      }

      const updated = await prisma.address.update({
        where: { id: req.params.id },
        data: req.body,
      });
      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  async remove(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const address = await prisma.address.findFirst({
        where: { id: req.params.id, userId: req.userId! },
      });
      if (!address) throw new AppError("Address not found", 404);

      await prisma.address.delete({ where: { id: req.params.id } });
      res.json({ success: true, message: "Address deleted" });
    } catch (error) {
      next(error);
    }
  }
}

export const addressController = new AddressController();
