import {
    findBanners,
    getBannerCount,
    createBanner,
    updateBanner,
    deleteBanners,
    updateBannerOrders,
} from "../services/banner.js";

import {
    uploadBannerImage,
} from "../services/image.js";


// 배너 전체 조회
export const getBanners = async (req, res) => {
    try {
        const data = await findBanners();

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


// 배너 신규 등록
export const postBanner = async (req, res) => {
    try {
        const {
            title,
            link = "",
            active = "true",
        } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "title이 필요합니다.",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "배너 이미지가 필요합니다.",
            });
        }

        // 최대 5개 제한
        const count = await getBannerCount();

        if (count >= 5) {
            return res.status(400).json({
                success: false,
                message: "배너는 최대 5개까지 등록할 수 있습니다.",
            });
        }

        // Storage 이미지 업로드
        const image = await uploadBannerImage(req.file);

        const data = await createBanner({
            title,
            link,
            image,
            active: active === "true",
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


export const patchBanner = async (req, res) => {
    try {
        const {
            id,
            title,
            link,
            active,
            sortOrder,
        } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "id가 필요합니다.",
            });
        }

        let image;

        // 새 이미지를 선택했을 때만 Storage 업로드
        if (req.file) {
            image = await uploadBannerImage(req.file);
        }

        const data = await updateBanner({
            id,
            title,
            link,
            image,

            // form-data에서는 boolean이 문자열로 들어옴
            active:
                active !== undefined
                    ? active === "true"
                    : undefined,
                        sortOrder:
            sortOrder !== undefined
                ? Number(sortOrder)
                : undefined,
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


export const removeBanners = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "삭제할 배너 id가 필요합니다.",
            });
        }

        const data = await deleteBanners(ids);

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

export const patchBannerOrders = async (req, res) => {
    try {
        const { orders } = req.body;

        if (!Array.isArray(orders) || orders.length === 0) {
            return res.status(400).json({
                success: false,
                message: "변경할 배너 순서가 필요합니다.",
            });
        }

        const isInvalid = orders.some(
            (item) =>
                item.id === undefined ||
                item.sortOrder === undefined
        );

        if (isInvalid) {
            return res.status(400).json({
                success: false,
                message: "배너 순서 데이터가 올바르지 않습니다.",
            });
        }

        const data = await updateBannerOrders(orders);

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