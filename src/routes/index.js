import { Router } from "express";

import homeRouter from "./home.js";
import menuRouter from "./menu.js";
import bannerRouter from "./banner.js";
import contentRouter from "./content.js";
import authRouter from "./auth.js";

const router = Router();

router.use("/", homeRouter);
router.use("/menus", menuRouter);
router.use("/banners", bannerRouter);
router.use("/contents", contentRouter);
router.use("/auth", authRouter);

export default router;