import { Router } from "express";

import {
    getContents,
    postContents,
    getContentDetail,
    removeContents,
    patchContentDetail,
} from "../controllers/content.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = Router();

router.get("/", getContents);

router.get("/detail", getContentDetail);

router.post(
    "/",
    authMiddleware,
    upload.array("images"),
    postContents
);

router.patch(
    "/detail",
    authMiddleware,
    upload.array("images"),
    patchContentDetail
);

router.delete(
    "/",
    authMiddleware,
    removeContents
);

export default router;