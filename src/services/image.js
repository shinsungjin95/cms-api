import supabase from "../config/supabase.js";

export const uploadImages = async (files) => {
    const images = [];

    for (const file of files) {
        const fileName = `${Date.now()}-${crypto.randomUUID()}-${file.originalname}`;

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