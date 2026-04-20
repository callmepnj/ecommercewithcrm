import { Router } from "express";
import { cartController } from "../controllers/cartController";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { addToCartSchema } from "../validators";

const router = Router();

router.use(authenticate);

router.get("/", cartController.getCart);
router.post("/items", validate(addToCartSchema), cartController.addItem);
router.put("/items/:itemId", cartController.updateItem);
router.delete("/items/:itemId", cartController.removeItem);
router.delete("/", cartController.clearCart);

export { router as cartRoutes };
