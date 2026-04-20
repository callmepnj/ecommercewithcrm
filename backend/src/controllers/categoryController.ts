import { Request, Response, NextFunction } from "express";
import prisma from "../config/database";
import { AppError } from "../middleware/errorHandler";
import { AuthRequest } from "../middleware/auth";

export class CategoryController {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        include: { _count: { select: { products: true } } },
      });
      res.json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await prisma.category.findUnique({
        where: { slug: req.params.slug },
        include: { _count: { select: { products: true } } },
      });
      if (!category) throw new AppError("Category not found", 404);
      res.json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, nameHi, description, image } = req.body;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const category = await prisma.category.create({
        data: { name, nameHi, slug, description, image },
      });
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const category = await prisma.category.update({
        where: { id: req.params.id },
        data: req.body,
      });
      res.json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  }

  async remove(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await prisma.category.update({
        where: { id: req.params.id },
        data: { isActive: false },
      });
      res.json({ success: true, message: "Category removed" });
    } catch (error) {
      next(error);
    }
  }
}

export const categoryController = new CategoryController();
