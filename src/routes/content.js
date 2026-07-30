import { Router } from "express";
import { getContents } from "../controllers/content.js";

const router = Router();

router.get("/", getContents);

export default router;