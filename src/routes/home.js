import { Router } from "express";
import { getHome } from "../controllers/home.js";

const router = Router();

router.get("/", getHome);

export default router;