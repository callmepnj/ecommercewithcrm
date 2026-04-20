import prisma from "../config/database";

export class OrderRepository {
  async create(data: {
    userId: string;
    addressId: string;
    paymentMethod: "COD" | "ONLINE";
    notes?: string;
    items: { productId: string; quantity: number; size?: string; price: number }[];
  }) {
    const orderNumber = `AAINA-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const subtotal = data.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shippingCharge = subtotal >= 999 ? 0 : 99;
    const total = subtotal + shippingCharge;

    return prisma.order.create({
      data: {
        orderNumber,
        userId: data.userId,
        addressId: data.addressId,
        paymentMethod: data.paymentMethod,
        subtotal,
        shippingCharge,
        total,
        notes: data.notes,
        status: "PENDING",
        paymentStatus: data.paymentMethod === "COD" ? "PENDING" : "PENDING",
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            price: item.price,
            total: item.price * item.quantity,
          })),
        },
      },
      include: {
        items: { include: { product: true } },
        address: true,
      },
    });
  }

  async findByUser(userId: string, page = 1, limit = 10) {
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          items: {
            include: {
              product: {
                include: { images: { where: { isPrimary: true }, take: 1 } },
              },
            },
          },
        },
      }),
      prisma.order.count({ where: { userId } }),
    ]);

    return { orders, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: { include: { images: true } } } },
        address: true,
        user: { select: { name: true, phone: true, email: true } },
      },
    });
  }

  async findByOrderNumber(orderNumber: string) {
    return prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: { include: { product: { include: { images: true } } } },
        address: true,
      },
    });
  }

  async updateStatus(id: string, status: string) {
    return prisma.order.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async updatePayment(
    id: string,
    data: {
      razorpayOrderId?: string;
      razorpayPaymentId?: string;
      razorpaySignature?: string;
      paymentStatus: string;
    }
  ) {
    return prisma.order.update({
      where: { id },
      data: data as any,
    });
  }

  async getAll(page = 1, limit = 20, status?: string) {
    const where = status ? { status: status as any } : {};
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: { select: { name: true, phone: true } },
          items: { include: { product: { select: { name: true } } } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getDashboardStats() {
    const [totalOrders, totalRevenue, pendingOrders, todayOrders] =
      await Promise.all([
        prisma.order.count(),
        prisma.order.aggregate({
          _sum: { total: true },
          where: { paymentStatus: "PAID" },
        }),
        prisma.order.count({ where: { status: "PENDING" } }),
        prisma.order.count({
          where: {
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        }),
      ]);

    return {
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      pendingOrders,
      todayOrders,
    };
  }
}

export const orderRepository = new OrderRepository();
