import { Router } from "express";
import { addressController } from "../controllers/addressController";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { addressSchema } from "../validators";

const router = Router();

router.use(authenticate);

router.get("/", addressController.getAll);
router.post("/", validate(addressSchema), addressController.create);
router.put("/:id", addressController.update);
router.delete("/:id", addressController.remove);

export { router as addressRoutes };
