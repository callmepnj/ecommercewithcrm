import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "path";
import { config } from "./config";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { authRoutes } from "./routes/auth";
import { productRoutes } from "./routes/products";
import { cartRoutes } from "./routes/cart";
import { orderRoutes } from "./routes/orders";
import { wishlistRoutes } from "./routes/wishlist";
import { categoryRoutes } from "./routes/categories";
import { addressRoutes } from "./routes/addresses";
import { adminRoutes } from "./routes/admin";
import { uploadRoutes } from "./routes/upload";

const app = express();

// Security
app.use(helmet());
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests, please try again later" },
});
app.use("/api/", limiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression() as any);

// Logging
if (config.nodeEnv !== "test") {
  app.use(morgan("dev"));
}

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/addresses", addressRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/upload", uploadRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`🚀 AAINA BOUTIQUE API running on port ${config.port}`);
  console.log(`📡 Environment: ${config.nodeEnv}`);
});

export default app;
