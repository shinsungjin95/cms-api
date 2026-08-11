import { uploadImages } from "../services/image.js";

export const postImages = async (req, res) => {
    try {
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "이미지 파일이 필요합니다.",
            });
        }

        const images = await uploadImages(files);

        return res.status(201).json({
            success: true,
            data: {
                images,
            },
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};