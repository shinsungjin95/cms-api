import supabase from "../config/supabase.js";

/**
 * 백업 데이터를 기준으로 CMS 데이터 복구
 */
export const resetCmsData = async () => {
    const tables = [
        "menu",
        "contents",
        "banners",
        "banner_config",
    ];

    for (const table of tables) {
        const backupTable = `${table}_backup`;

        // 백업 데이터 조회
        const {
            data: backupData,
            error: backupError,
        } = await supabase
            .from(backupTable)
            .select("*");

        if (backupError) {
            throw backupError;
        }

        // 현재 데이터 전체 삭제
        const {
            error: deleteError,
        } = await supabase
            .from(table)
            .delete()
            .not("id", "is", null);

        if (deleteError) {
            throw deleteError;
        }

        // 백업 데이터 복구
        if (backupData?.length) {
            const {
                error: insertError,
            } = await supabase
                .from(table)
                .insert(backupData);

            if (insertError) {
                throw insertError;
            }
        }
    }

    return {
        success: true,
    };
};