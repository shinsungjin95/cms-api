import { Router } from "express";

import {
    getBanners,
    postBanner,
    patchBanner,
    removeBanners,
    patchBannerOrders,
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
    "/order",
    authMiddleware,
    patchBannerOrders
);

router.patch(
    "/",
    authMiddleware,
    upload.single("image"),
    patchBanner
);

router.delete(
    "/",
    authMiddleware,
    removeBanners
);

export default router;