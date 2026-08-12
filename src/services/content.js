import supabase from "../config/supabase.js";

export const findContents = async ({
    menuId,
    offset,
    limit,
    title,
    startDate,
    endDate,
}) => {
    const from = offset;
    const to = offset + limit - 1;

    let query = supabase
        .from("contents")
        .select(
            "id, menu_id, title, images, content, created_at, updated_at",
            { count: "exact" }
        )
        .eq("menu_id", menuId);

    // 제목 검색
    if (title) {
        query = query.ilike("title", `%${title}%`);
    }

    // 시작일
    if (startDate) {
        query = query.gte(
            "updated_at",
            `${startDate}T00:00:00`
        );
    }

    // 종료일
    if (endDate) {
        query = query.lte(
            "updated_at",
            `${endDate}T23:59:59.999`
        );
    }

    const { data, error, count } = await query
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

export const updateContent = async ({
    detailId,
    menuId,
    title,
    images,
    content,
}) => {
    const { data, error } = await supabase
        .from("contents")
        .update({
            menu_id: menuId,
            title,
            images,
            content,
            updated_at: new Date().toISOString(),
        })
        .eq("id", detailId)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
};