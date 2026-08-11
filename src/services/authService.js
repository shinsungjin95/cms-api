import supabase from "../config/supabase.js";

export const findAdminByUserId = async (userId) => {
    const { data, error } = await supabase
        .from("admin_user")
        .select("id, user_id, password")
        .eq("user_id", userId)
        .maybeSingle();

    if (error) {
        throw error;
    }

    return data;
};