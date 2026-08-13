import supabase from "../config/supabase.js";

export const uploadImages = async (files) => {
    const images = [];

    for (const file of files) {
        const extension = file.mimetype.split("/")[1] || "jpg";

        const fileName =
            `${Date.now()}-${crypto.randomUUID()}.${extension}`;

        const { error } = await supabase.storage
            .from("contents")
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
            });

        if (error) {
            throw error;
        }

        const { data } = supabase.storage
            .from("contents")
            .getPublicUrl(fileName);

        images.push({
            url: data.publicUrl,
        });
    }

    return images;
};



export const uploadBannerImage = async (file) => {
    const extension = file.mimetype.split("/")[1] || "jpg";

    const fileName =
        `${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
        .from("banners")
        .upload(fileName, file.buffer, {
            contentType: file.mimetype,
        });

    if (error) {
        throw error;
    }

    const { data } = supabase.storage
        .from("banners")
        .getPublicUrl(fileName);

    return {
        url: data.publicUrl,
    };
};