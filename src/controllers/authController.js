import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { findAdminByUserId } from "../services/authService.js";

export const login = async (req, res) => {
    try {
        const { userId, password } = req.body;

        if (!userId || !password) {
            return res.status(400).json({
                message: "아이디와 비밀번호를 입력해 주세요.",
            });
        }
        const user = await findAdminByUserId(userId);
        if (!user) {
            return res.status(400).json({
                message: "아이디 또는 비밀번호가 올바르지 않습니다.",
            });
        }
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );
        if (!passwordMatch) {
            return res.status(400).json({
                message: "아이디 또는 비밀번호가 올바르지 않습니다.",
            });
        }
        const token = jwt.sign(
            {
                id: user.id,
                userId: user.user_id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "5h",
            }
        );
        return res.status(200).json({
            token,
        });
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        return res.status(500).json({
            message: "로그인 처리 중 오류가 발생했습니다.",
        });
    }
};