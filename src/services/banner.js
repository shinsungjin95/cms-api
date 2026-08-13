import supabase from "../config/supabase.js";


// 배너 전체 조회
export const findBanners = async () => {
    const { data, error } = await supabase
        .from("banners")
        .select(
            "id, title, link, image, active, sort_order, created_at, updated_at"
        )
        .order("sort_order", { ascending: true });

    if (error) {
        throw error;
    }

    return data;
};


// 배너 개수 조회
export const getBannerCount = async () => {
    const { count, error } = await supabase
        .from("banners")
        .select("*", {
            count: "exact",
            head: true,
        });

    if (error) {
        throw error;
    }

    return count ?? 0;
};


// 배너 등록
export const createBanner = async ({
    title,
    link,
    image,
    active,
}) => {
    const { data, error } = await supabase
        .from("banners")
        .insert({
            title,
            link,
            image,
            active,
        })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
};


export const updateBanner = async ({
    id,
    title,
    link,
    image,
    active,
    sortOrder,
}) => {
    const updateData = {
        updated_at: new Date().toISOString(),
    };

    if (title !== undefined) {
        updateData.title = title;
    }

    if (link !== undefined) {
        updateData.link = link;
    }

    if (image !== undefined) {
        updateData.image = image;
    }

    if (active !== undefined) {
        updateData.active = active;
    }

    if (sortOrder !== undefined) {
        updateData.sort_order = sortOrder;
    }

    const { data, error } = await supabase
        .from("banners")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
};


export const deleteBanners = async (ids) => {
    const { data, error } = await supabase
        .from("banners")
        .delete()
        .in("id", ids)
        .select("id");

    if (error) {
        throw error;
    }

    return data;
};

export const updateBannerOrders = async (orders) => {
    const updates = orders.map(({ id, sortOrder }) => {
        return supabase
            .from("banners")
            .update({
                sort_order: sortOrder,
                updated_at: new Date().toISOString(),
            })
            .eq("id", id);
    });

    const results = await Promise.all(updates);

    const errorResult = results.find(({ error }) => error);

    if (errorResult) {
        throw errorResult.error;
    }

    return orders;
};