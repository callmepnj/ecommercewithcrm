import { Router } from "express";
import { wishlistController } from "../controllers/wishlistController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/", wishlistController.getWishlist);
router.post("/:productId", wishlistController.addItem);
router.delete("/:productId", wishlistController.removeItem);

export { router as wishlistRoutes };
