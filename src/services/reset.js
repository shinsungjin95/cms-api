import supabase from "../config/supabase.js";

/**
 * 백업 테이블 데이터를 기준으로 CMS 데이터 복구
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

        console.log(`[RESET] ${table} 시작`);

        // 백업 데이터 조회
        const {
            data: backupData,
            error: backupError,
        } = await supabase
            .from(backupTable)
            .select("*");

        if (backupError) {
            console.error(`[RESET] ${backupTable} 조회 실패`, backupError);
            throw backupError;
        }

        console.log(
            `[RESET] ${backupTable} 백업 데이터:`,
            backupData?.length ?? 0
        );

        // 현재 데이터 전체 삭제
        const {
            error: deleteError,
        } = await supabase
            .from(table)
            .delete()
            .not("id", "is", null);

        if (deleteError) {
            console.error(`[RESET] ${table} 삭제 실패`, deleteError);
            throw deleteError;
        }

        console.log(`[RESET] ${table} 삭제 완료`);

        // 백업 데이터 복구
        if (backupData?.length) {
            const {
                error: insertError,
            } = await supabase
                .from(table)
                .insert(backupData);

            if (insertError) {
                console.error(`[RESET] ${table} 복구 실패`, insertError);
                throw insertError;
            }

            console.log(`[RESET] ${table} 복구 완료`);
        }
    }

    console.log("[RESET] 전체 복구 완료");

    return {
        success: true,
    };
};