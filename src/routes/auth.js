import express from "express";
import { login } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);

router.get("/check", authMiddleware, (req, res) => {
    return res.status(200).json({
        message: "인증 성공",
        user: req.user,
    });
});

export default router;