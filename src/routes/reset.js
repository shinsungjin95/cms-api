import express from "express";
import { resetCms } from "../controllers/reset.js";

const router = express.Router();

router.post("/", resetCms);

export default router;