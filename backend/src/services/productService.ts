import { productRepository } from "../repositories/productRepository";
import { AppError } from "../middleware/errorHandler";
import cloudinary from "../config/cloudinary";

export class ProductService {
  async getProducts(params: {
    page?: number;
    limit?: number;
    categorySlug?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
  }) {
    return productRepository.findAll(params);
  }

  async getProductBySlug(slug: string) {
    const product = await productRepository.findBySlug(slug);
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    return product;
  }

  async getFeaturedProducts() {
    return productRepository.getFeatured();
  }

  async createProduct(data: any) {
    // Generate slug from name
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      + "-" + Date.now().toString(36);

    // Auto-generate SKU if not provided
    const sku = data.sku || ("SKU-" + Date.now().toString(36).toUpperCase());

    // Map descriptionHi to descHi for Prisma
    const descHi = data.descriptionHi || data.descHi || undefined;

    const { categoryId, descriptionHi: _dh, ...rest } = data;

    return productRepository.create({
      ...rest,
      slug,
      sku,
      descHi,
      description: data.description || "",
      sizes: data.sizes || [],
      tags: data.tags || [],
      category: { connect: { id: categoryId } },
    });
  }

  async updateProduct(id: string, data: any) {
    const existing = await productRepository.findById(id);
    if (!existing) {
      throw new AppError("Product not found", 404);
    }

    // Map descriptionHi to descHi for Prisma
    if (data.descriptionHi !== undefined) {
      data.descHi = data.descriptionHi;
      delete data.descriptionHi;
    }

    if (data.categoryId) {
      data.category = { connect: { id: data.categoryId } };
      delete data.categoryId;
    }

    return productRepository.update(id, data);
  }

  async deleteProduct(id: string) {
    const existing = await productRepository.findById(id);
    if (!existing) {
      throw new AppError("Product not found", 404);
    }
    return productRepository.delete(id);
  }

  async uploadImage(file: Express.Multer.File, productId: string) {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "aaina-boutique/products",
      transformation: [
        { width: 800, height: 1000, crop: "fill", quality: "auto" },
      ],
    });

    return { url: result.secure_url, publicId: result.public_id };
  }
}

export const productService = new ProductService();
