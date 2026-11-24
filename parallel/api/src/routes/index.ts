import { Router } from "express";
import authRoutes from "./auth.routes";
import healthRoutes from "./health.routes";
import ordersRoutes from "./orders.routes";
import productsRoutes from "./products.routes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/login", authRoutes);
router.use("/products", productsRoutes);
router.use("/orders", ordersRoutes);

export default router;
