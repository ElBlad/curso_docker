import { Router } from "express";
import { getOrders } from "../controllers/catalog.controller";

const router = Router();

router.get("/", getOrders);

export default router;
