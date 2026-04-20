import { Router } from "express";
import { authController } from "../controllers/authController";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { registerSchema, loginSchema, otpRequestSchema } from "../validators";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/request-otp", validate(otpRequestSchema), authController.requestOtp);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);
router.get("/profile", authenticate, authController.getProfile);
router.put("/profile", authenticate, authController.updateProfile);

export { router as authRoutes };
