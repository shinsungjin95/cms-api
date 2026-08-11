import { Router } from "express";
import {
    getMenus,
    postMenus,
} from "../controllers/menu.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

// 홈페이지에서도 사용 → 공개
router.get("/", getMenus);

// 관리자만 저장 가능 → JWT 필요
router.post("/", authMiddleware, postMenus);

export default router;