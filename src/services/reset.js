import supabase from "../config/supabase.js";

/**
 * 백업 데이터를 기준으로 CMS 데이터 전체 복구
 */
export const resetCmsData = async () => {
    const { error } = await supabase.rpc(
        "reset_cms_data"
    );

    if (error) {
        console.error("[RESET] CMS 복구 실패", error);
        throw error;
    }

    console.log("[RESET] CMS 전체 복구 완료");

    return {
        success: true,
    };
};