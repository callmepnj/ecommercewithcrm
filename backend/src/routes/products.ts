import { Router } from "express";
import { productController } from "../controllers/productController";
import { authenticate, requireAdmin } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createProductSchema } from "../validators";

const router = Router();

router.get("/", productController.getProducts);
router.get("/featured", productController.getFeatured);
router.get("/:slug", productController.getProduct);
router.post("/", authenticate, requireAdmin, validate(createProductSchema), productController.createProduct);
router.put("/:id", authenticate, requireAdmin, productController.updateProduct);
router.delete("/:id", authenticate, requireAdmin, productController.deleteProduct);

export { router as productRoutes };
