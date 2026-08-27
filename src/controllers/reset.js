import { resetCmsData } from "../services/reset.js";

/**
 * CMS 데이터를 백업 상태로 복구
 */
export const resetCms = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (
            !process.env.CRON_SECRET ||
            authHeader !== `Bearer ${process.env.CRON_SECRET}`
        ) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        await resetCmsData();

        return res.status(200).json({
            success: true,
            message: "CMS 데이터가 초기 상태로 복구되었습니다.",
        });
    } catch (error) {
        console.error("CMS RESET ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};