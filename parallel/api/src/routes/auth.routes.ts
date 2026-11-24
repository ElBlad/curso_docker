import { Router } from "express";
import { postLogin } from "../controllers/auth.controller";

const router = Router();

router.post("/", postLogin);

export default router;
