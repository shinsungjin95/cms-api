import { uploadImages } from "../services/image.js";

import {
    findContents,
    createContent,
    findContentDetail,
    deleteContents,
    updateContent,
} from "../services/content.js";

export const getContents = async (req, res) => {
    try {
        const {
            menuId,
            offset = "0",
            limit = "10",
            title,
            startDate,
            endDate,
        } = req.query;

        if (!menuId) {
            return res.status(400).json({
                success: false,
                message: "menuId가 필요합니다.",
            });
        }

        const data = await findContents({
            menuId,
            offset: Number(offset),
            limit: Number(limit),
            title,
            startDate,
            endDate,
        });

        return res.status(200).json({
            success: true,
            data,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const postContents = async (req, res) => {
    try {
        const {
            menuId,
            title,
            content = "",
        } = req.body;

        if (!menuId) {
            return res.status(400).json({
                success: false,
                message: "menuId가 필요합니다.",
            });
        }

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "title이 필요합니다.",
            });
        }

        const images = req.files?.length
            ? await uploadImages(req.files)
            : [];

        const data = await createContent({
            menuId,
            title,
            images,
            content,
        });

        return res.status(201).json({
            success: true,
            data,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const getContentDetail = async (req, res) => {
    try {
        const { detailId } = req.query;

        if (!detailId) {
            return res.status(400).json({
                success: false,
                message: "detailId가 필요합니다.",
            });
        }

        const data = await findContentDetail(detailId);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "컨텐츠를 찾을 수 없습니다.",
            });
        }

        return res.status(200).json({
            success: true,
            data,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const removeContents = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "삭제할 컨텐츠 id가 필요합니다.",
            });
        }

        const data = await deleteContents(ids);

        return res.status(200).json({
            success: true,
            data,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const patchContentDetail = async (req, res) => {
    try {
        const {
            detailId,
            menuId,
            title,
            content = "",
            existingImages = "[]",
        } = req.body;

        if (!detailId) {
            return res.status(400).json({
                success: false,
                message: "detailId가 필요합니다.",
            });
        }

        if (!menuId) {
            return res.status(400).json({
                success: false,
                message: "menuId가 필요합니다.",
            });
        }

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "title이 필요합니다.",
            });
        }

        // 프론트 FormData에서 JSON.stringify해서 보내기 때문에 파싱
        let currentImages = [];

        try {
            currentImages = JSON.parse(existingImages);
        } catch {
            return res.status(400).json({
                success: false,
                message: "existingImages 형식이 올바르지 않습니다.",
            });
        }

        // 새로 추가한 이미지가 있으면 Storage 업로드
        const newImages = req.files?.length
            ? await uploadImages(req.files)
            : [];

        // 기존에 남겨둔 이미지 + 새 이미지
        const images = [
            ...currentImages,
            ...newImages,
        ];

        const data = await updateContent({
            detailId,
            menuId,
            title,
            images,
            content,
        });

        return res.status(200).json({
            success: true,
            data,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};