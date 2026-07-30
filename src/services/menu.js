import supabase from "../config/supabase.js";

export const findMenus = async () => {
    const { data, error } = await supabase
        .from("menu")
        .select("menu_json")
        .single();

    if (error) {
        throw error;
    }

    return data["menu_json"];
};

export const updateMenus = async (menus) => {
    const { data, error } = await supabase
        .from("menu")
        .update({
            menu_json: menus,
        })
        .eq("id", 1)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data["menu_json"];
};