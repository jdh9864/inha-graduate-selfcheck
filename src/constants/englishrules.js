export const ENGLISH_LABELS = {
    TOEIC: "토익",
    TOEIC_SPICKING: "토익 스피킹",
    TOEFL_PBT: "토플 PBT",
    TOEFL_CBT: "토플 CBT",
    TOEFL_IBT: "토플 iBT",
    NEW_TEPS: "뉴텝스",
    OPIC: "오픽",
    IELTS: "IELTS",
};

// 서버 실패 시 사용할 기본 타입 목록
export const FALLBACK_TYPES = [
    "TOEIC",
    "TOEIC_SPICKING",
    "TOEFL_IBT",
    "NEW_TEPS",
    "OPIC",
    "IELTS",
];

/**
 * 타입별 점수/등급 입력 규격
 * kind:
 *  - "numeric": 숫자 입력 1개
 *  - "grade": 등급/레벨 선택(또는 텍스트) 1개
 *  - "numeric+grade": 숫자 + 레벨
 */
export const TYPE_RULES = {
    TOEIC:         { kind: "numeric",      min: 0,   max: 990, step: 1,   placeholder: "예: 900" },
    TOEIC_SPICKING:{ kind: "numeric+grade",min: 0,   max: 200, step: 1,   placeholder: "예: 160", levels: ["LV9","LV8","LV7","LV6","LV5","LV4","LV3","LV2","LV1"] },
    TOEFL_PBT:     { kind: "numeric",      min: 310, max: 677, step: 1,   placeholder: "예: 550" },
    TOEFL_CBT:     { kind: "numeric",      min: 0,   max: 300, step: 1,   placeholder: "예: 213" },
    TOEFL_IBT:     { kind: "numeric",      min: 0,   max: 120, step: 1,   placeholder: "예: 90" },
    NEW_TEPS:      { kind: "numeric",      min: 0,   max: 600, step: 1,   placeholder: "예: 320" },
    OPIC:          { kind: "grade",        placeholder: "예: IH / AL 등", grades: ["AL","IH","IM3","IM2","IM1","IL","NH"] },
    IELTS:         { kind: "numeric",      min: 0,   max: 9,   step: 0.5, placeholder: "예: 6.5" },
};

// 유틸: 서버/폴백 목록을 받아 표시 옵션으로 변환
export const toOptions = (types) =>
    (types || []).map((t) => ({ value: t, label: ENGLISH_LABELS[t] || t }));
