import {
    findMenus,
    updateMenus,
} from "../services/menu.js";


export const getMenus = async (req, res) => {
    try {
        const menus = await findMenus();

        res.status(200).json({
            success: true,
            data: menus,
        });
    } catch (error) {
        console.log(error);

        res.status(500).json(error);
    }
};

export const postMenus = async (req, res) => {
    try {
        const menus = await updateMenus(req.body);

        res.status(200).json({
            success: true,
            message: "메뉴가 저장되었습니다.",
            data: menus,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
