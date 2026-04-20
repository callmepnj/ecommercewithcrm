import { Request, Response, NextFunction } from "express";
import { productService } from "../services/productService";

export class ProductController {
  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, category, search, minPrice, maxPrice, sortBy } = req.query;
      const result = await productService.getProducts({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        categorySlug: category as string,
        search: search as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        sortBy: sortBy as string,
      });
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getProductBySlug(req.params.slug);
      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  async getFeatured(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await productService.getFeaturedProducts();
      res.json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      await productService.deleteProduct(req.params.id);
      res.json({ success: true, message: "Product deleted" });
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();
