import { Router } from "express";

import {
    getBanners,
    postBanner,
    patchBanner,
    removeBanners,
    patchBannerOrders,
    patchBannerConfig,
} from "../controllers/banner.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = Router();

router.get("/", getBanners);

router.post(
    "/",
    authMiddleware,
    upload.single("image"),
    postBanner
);

router.patch(
    "/",
    authMiddleware,
    upload.single("image"),
    patchBanner
);

router.patch(
    "/order",
    authMiddleware,
    patchBannerOrders
);

router.patch(
    "/config",
    authMiddleware,
    patchBannerConfig
);

router.delete(
    "/",
    authMiddleware,
    removeBanners
);

export default router;