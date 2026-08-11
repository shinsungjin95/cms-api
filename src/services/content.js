import supabase from "../config/supabase.js";

export const findContents = async ({
    menuId,
    offset,
    limit,
}) => {
    const from = offset;
    const to = offset + limit - 1;

    const { data, error, count } = await supabase
        .from("contents")
        .select(
            "id, menu_id, title, images, content, created_at, updated_at",
            { count: "exact" }
        )
        .eq("menu_id", menuId)
        .order("id", { ascending: false })
        .range(from, to);

    if (error) {
        throw error;
    }

    return {
        list: data,
        totalCount: count ?? 0,
    };
};

export const createContent = async ({
    menuId,
    title,
    images,
    content,
}) => {
    const { data, error } = await supabase
        .from("contents")
        .insert({
            menu_id: menuId,
            title,
            images,
            content,
        })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
};

export const findContentDetail = async (detailId) => {
    const { data, error } = await supabase
        .from("contents")
        .select(
            "id, menu_id, title, images, content, created_at, updated_at"
        )
        .eq("id", detailId)
        .maybeSingle();

    if (error) {
        throw error;
    }

    return data;
};

export const deleteContents = async (ids) => {
    const { data, error } = await supabase
        .from("contents")
        .delete()
        .in("id", ids)
        .select("id");

    if (error) {
        throw error;
    }

    return data;
};