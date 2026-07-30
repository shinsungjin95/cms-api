export const getHome = (req, res) => {
    res.status(200).json({
        success: true,
        message: "CMS API Server",
    });
};