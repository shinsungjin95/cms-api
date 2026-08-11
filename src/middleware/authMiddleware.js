import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "인증이 필요합니다.",
        });
    }

    const token = authorization.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "토큰이 만료되었거나 유효하지 않습니다.",
        });
    }
};