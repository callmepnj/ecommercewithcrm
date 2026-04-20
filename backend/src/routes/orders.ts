import { Router } from "express";
import { orderController } from "../controllers/orderController";
import { authenticate, requireAdmin } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createOrderSchema } from "../validators";

const router = Router();

router.use(authenticate);

router.post("/", validate(createOrderSchema), orderController.createOrder);
router.get("/", orderController.getUserOrders);
router.get("/:id", orderController.getOrder);
router.post("/verify-payment", orderController.verifyPayment);
router.get("/track/:orderNumber", orderController.trackOrder);

export { router as orderRoutes };
