import prisma from "../config/database";

export class CartRepository {
  async getOrCreate(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { images: { where: { isPrimary: true }, take: 1 } },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: { images: { where: { isPrimary: true }, take: 1 } },
              },
            },
          },
        },
      });
    }

    return cart;
  }

  async addItem(
    userId: string,
    productId: string,
    quantity: number,
    size?: string
  ) {
    const cart = await this.getOrCreate(userId);

    const existing = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId, size: size || null },
    });

    if (existing) {
      return prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: { product: true },
      });
    }

    return prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity, size },
      include: { product: true },
    });
  }

  async updateItemQuantity(itemId: string, quantity: number) {
    if (quantity <= 0) {
      return prisma.cartItem.delete({ where: { id: itemId } });
    }
    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  async removeItem(itemId: string) {
    return prisma.cartItem.delete({ where: { id: itemId } });
  }

  async clear(userId: string) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
  }
}

export const cartRepository = new CartRepository();
