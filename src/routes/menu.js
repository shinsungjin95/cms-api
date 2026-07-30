import { Router } from "express";
import {
    getMenus,
    postMenus,
} from "../controllers/menu.js";

const router = Router();

router.get("/", getMenus);
router.post("/", postMenus);

export default router;