import { Router } from "express";
import { categoryController } from "../controllers/categoryController";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/", categoryController.getAll);
router.get("/:slug", categoryController.getBySlug);
router.post("/", authenticate, requireAdmin, categoryController.create);
router.put("/:id", authenticate, requireAdmin, categoryController.update);
router.delete("/:id", authenticate, requireAdmin, categoryController.remove);

export { router as categoryRoutes };
