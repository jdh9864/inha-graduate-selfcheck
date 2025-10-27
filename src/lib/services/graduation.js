import { GraduationCheckAPI } from "../api";
import { buildGraduationCheckPayload, mapGraduationCheckResponse } from "../payloads/graduationcheck";

/**
 * 컨텍스트를 받아 → 페이로드 빌드 → API 호출 → 뷰모델 반환
 */
export async function runGraduationCheck(context) {
    const payload = buildGraduationCheckPayload(context);

    // 필수 값 간단 검증
    if (!payload.english.testType) throw new Error("영어 시험 타입 누락");
    if (!payload.studentId || !payload.department) throw new Error("학생/학과 정보 누락");
    // gpa는 빌더에서 기본값 0 보장

    const res = await GraduationCheckAPI.check(payload);
    const view = mapGraduationCheckResponse(res);
    return { payload, res, view };
}
