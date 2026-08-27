import { Router } from "express";

import homeRouter from "./home.js";
import menuRouter from "./menu.js";
import bannerRouter from "./banner.js";
import contentRouter from "./content.js";
import authRouter from "./auth.js";
import resetRouter from "./reset.js";

const router = Router();

router.use("/", homeRouter);
router.use("/menus", menuRouter);
router.use("/banners", bannerRouter);
router.use("/contents", contentRouter);
router.use("/auth", authRouter);
router.use("/reset", resetRouter);

export default router;