import { Router } from "express";
import multer from "multer";
import { authenticate, requireAdmin, AuthRequest } from "../middleware/auth";
import { productService } from "../services/productService";
import prisma from "../config/database";
import { Response, NextFunction } from "express";

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

const router = Router();

router.use(authenticate);
router.use(requireAdmin);

router.post("/product-image/:productId", upload.single("image"), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image provided" });
    }

    const result = await productService.uploadImage(req.file, req.params.productId);

    const image = await prisma.productImage.create({
      data: {
        productId: req.params.productId,
        url: result.url,
        altText: req.body.altText || "",
        isPrimary: req.body.isPrimary === "true",
        sortOrder: parseInt(req.body.sortOrder || "0"),
      },
    });

    res.status(201).json({ success: true, data: image });
  } catch (error) {
    next(error);
  }
});

router.delete("/product-image/:imageId", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.productImage.delete({ where: { id: req.params.imageId } });
    res.json({ success: true, message: "Image deleted" });
  } catch (error) {
    next(error);
  }
});

export { router as uploadRoutes };
