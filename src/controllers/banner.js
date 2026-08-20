import {
    findBanners,
    findBannerById,
    getBannerCount,
    createBanner,
    updateBanner,
    deleteBanners,
    updateBannerOrders,
    findBannerConfig,
    updateBannerConfig,
} from "../services/banner.js";

import {
    uploadBannerImage,
} from "../services/image.js";


// 배너 전체 조회
export const getBanners = async (req, res) => {
    try {
        const [items, config] = await Promise.all([
            findBanners(),
            findBannerConfig(),
        ]);

        return res.status(200).json({
            success: true,
            data: {
                config,
                items,
            },
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

        const pcFile = req.files?.pcImage?.[0];
        const moFile = req.files?.moImage?.[0];

        if (!pcFile || !moFile) {
            return res.status(400).json({
                success: false,
                message: "PC 이미지와 모바일 이미지를 모두 등록해 주세요.",
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

        // PC / 모바일 이미지 Storage 업로드
        const pcImage = await uploadBannerImage(pcFile);
        const moImage = await uploadBannerImage(moFile);

        const image = {
            pc: pcImage,
            mo: moImage,
        };

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
        } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "id가 필요합니다.",
            });
        }

        const currentBanner = await findBannerById(id);

        const pcFile = req.files?.pcImage?.[0];
        const moFile = req.files?.moImage?.[0];

        let image = currentBanner.image;

        // PC 또는 MO 이미지가 새로 들어온 경우
        if (pcFile || moFile) {
            image = {
                pc: pcFile
                    ? await uploadBannerImage(pcFile)
                    : currentBanner.image?.pc,

                mo: moFile
                    ? await uploadBannerImage(moFile)
                    : currentBanner.image?.mo,
            };
        }

        const data = await updateBanner({
            id,
            title,
            link,
            image,
            active:
                active !== undefined
                    ? active === "true"
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
export const patchBannerConfig = async (req, res) => {
    try {
        const { config } = req.body;

        if (!config) {
            return res.status(400).json({
                success: false,
                message: "배너 설정 정보가 필요합니다.",
            });
        }

        const effectList = [
            "slide",
            "fade",
        ];

        const paginationTypeList = [
            "bullet",
            "progress",
            "fraction",
        ];

        const paginationPositionList = [
            "bottom-left",
            "bottom-center",
            "bottom-right",
        ];

        const autoplayDelayList = [
            1500,
            2000,
            2500,
        ];

        if (!effectList.includes(config.effect)) {
            return res.status(400).json({
                success: false,
                message: "올바르지 않은 배너 효과입니다.",
            });
        }

        if (
            typeof config.navigation?.active !== "boolean"
        ) {
            return res.status(400).json({
                success: false,
                message: "navigation 설정이 올바르지 않습니다.",
            });
        }

        if (
            typeof config.pagination?.active !== "boolean" ||
            !paginationTypeList.includes(
                config.pagination?.type
            ) ||
            !paginationPositionList.includes(
                config.pagination?.position
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "pagination 설정이 올바르지 않습니다.",
            });
        }

        if (
            typeof config.autoplay?.active !== "boolean" ||
            !autoplayDelayList.includes(
                config.autoplay?.delay
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "autoplay 설정이 올바르지 않습니다.",
            });
        }

        const data = await updateBannerConfig(config);

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