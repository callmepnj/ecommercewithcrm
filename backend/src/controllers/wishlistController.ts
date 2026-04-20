import { Response, NextFunction } from "express";
import prisma from "../config/database";
import { AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";

export class WishlistController {
  async getWishlist(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      let wishlist = await prisma.wishlist.findUnique({
        where: { userId: req.userId! },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { where: { isPrimary: true }, take: 1 },
                  category: { select: { name: true, slug: true } },
                },
              },
            },
            orderBy: { addedAt: "desc" },
          },
        },
      });

      if (!wishlist) {
        wishlist = await prisma.wishlist.create({
          data: { userId: req.userId! },
          include: {
            items: {
              include: {
                product: {
                  include: {
                    images: { where: { isPrimary: true }, take: 1 },
                    category: { select: { name: true, slug: true } },
                  },
                },
              },
            },
          },
        });
      }

      res.json({ success: true, data: wishlist });
    } catch (error) {
      next(error);
    }
  }

  async addItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const product = await prisma.product.findUnique({ where: { id: productId } });
      if (!product) throw new AppError("Product not found", 404);

      let wishlist = await prisma.wishlist.findUnique({ where: { userId: req.userId! } });
      if (!wishlist) {
        wishlist = await prisma.wishlist.create({ data: { userId: req.userId! } });
      }

      const existing = await prisma.wishlistItem.findUnique({
        where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
      });
      if (existing) {
        return res.json({ success: true, message: "Already in wishlist" });
      }

      await prisma.wishlistItem.create({
        data: { wishlistId: wishlist.id, productId },
      });

      res.status(201).json({ success: true, message: "Added to wishlist" });
    } catch (error) {
      next(error);
    }
  }

  async removeItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const wishlist = await prisma.wishlist.findUnique({ where: { userId: req.userId! } });
      if (!wishlist) throw new AppError("Wishlist not found", 404);

      await prisma.wishlistItem.delete({
        where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
      });

      res.json({ success: true, message: "Removed from wishlist" });
    } catch (error) {
      next(error);
    }
  }
}

export const wishlistController = new WishlistController();
