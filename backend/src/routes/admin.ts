import { Router } from "express";
import { authenticate, requireAdmin } from "../middleware/auth";
import { orderController } from "../controllers/orderController";
import { productController } from "../controllers/productController";
import { categoryController } from "../controllers/categoryController";
import { orderService } from "../services/orderService";
import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../config/database";

const router = Router();

router.use(authenticate);
router.use(requireAdmin);

// Dashboard
router.get("/dashboard", async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await orderService.getDashboardStats();
    const totalProducts = await prisma.product.count({ where: { isActive: true } });
    const totalUsers = await prisma.user.count({ where: { role: "CUSTOMER" } });
    res.json({ success: true, data: { ...stats, totalProducts, totalUsers } });
  } catch (error) {
    next(error);
  }
});

// Admin order management
router.get("/orders", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page, status } = req.query;
    const result = await orderService.getAllOrders(
      page ? parseInt(page as string) : undefined,
      status as string
    );
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.put("/orders/:id/status", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

// Admin product management (reuse existing controllers)
router.get("/products", productController.getProducts);
router.post("/products", productController.createProduct);
router.put("/products/:id", productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);

// Admin category management
router.get("/categories", categoryController.getAll);
router.post("/categories", categoryController.create);
router.put("/categories/:id", categoryController.update);
router.delete("/categories/:id", categoryController.remove);

// Admin users
router.get("/users", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 20;
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: { id: true, name: true, phone: true, email: true, role: true, isActive: true, createdAt: true },
      }),
      prisma.user.count(),
    ]);
    res.json({ success: true, data: { users, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } } });
  } catch (error) {
    next(error);
  }
});

export { router as adminRoutes };
