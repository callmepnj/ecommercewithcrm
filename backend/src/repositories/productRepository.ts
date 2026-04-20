import prisma from "../config/database";
import { Prisma } from "@prisma/client";

export class ProductRepository {
  async findAll(params: {
    page?: number;
    limit?: number;
    categorySlug?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    isFeatured?: boolean;
  }) {
    const {
      page = 1,
      limit = 12,
      categorySlug,
      search,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      isFeatured,
    } = params;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(categorySlug && { category: { slug: categorySlug } }),
      ...(isFeatured && { isFeatured: true }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { nameHi: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { tags: { hasSome: [search.toLowerCase()] } },
        ],
      }),
      ...(minPrice || maxPrice
        ? {
            price: {
              ...(minPrice && { gte: minPrice }),
              ...(maxPrice && { lte: maxPrice }),
            },
          }
        : {}),
    };

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      sortBy === "price_asc"
        ? { price: "asc" }
        : sortBy === "price_desc"
          ? { price: "desc" }
          : sortBy === "newest"
            ? { createdAt: "desc" }
            : { createdAt: "desc" };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: { select: { name: true, slug: true } },
          images: { orderBy: { sortOrder: "asc" }, take: 2 },
          _count: { select: { reviews: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: { select: { reviews: true } },
      },
    });
  }

  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: { category: true, images: true },
    });
  }

  async create(data: Prisma.ProductCreateInput) {
    return prisma.product.create({ data, include: { category: true } });
  }

  async update(id: string, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({
      where: { id },
      data,
      include: { category: true, images: true },
    });
  }

  async delete(id: string) {
    return prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getFeatured() {
    return prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: { select: { name: true, slug: true } },
      },
      take: 8,
    });
  }
}

export const productRepository = new ProductRepository();
