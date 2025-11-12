const n = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);
const b = (v, d = true) => (typeof v === "boolean" ? v : d);

/**
 * Home/Check에서 넘겨준 context → Swagger 페이로드
 * @param {object} ctx { studentId, department, english, parsed }
 * @returns Swagger GraduationCheckRequest payload
 */
export function buildGraduationCheckPayload(ctx = {}) {
    const transcriptRaw = ctx?.parsed?.data || {};
    const englishRaw = ctx?.english || {};

    // gpa 필수: pga가 있으면 gpa로 매핑
    const gpa = transcriptRaw.gpa ?? transcriptRaw.pga ?? 0;

    // 과목번호 문자열 배열 정리
    const completed = Array.from(
        new Set((transcriptRaw.completedCourseNumbers || []).map(String).filter(Boolean))
    );

    return {
        transcript: {
            gpa: n(gpa, 0),
            totalCredits: n(transcriptRaw.totalCredits),
            requiredMajorCredits: n(transcriptRaw.requiredMajorCredits),
            electiveMajorCredits: n(transcriptRaw.electiveMajorCredits),
            basicMajorCredits: n(transcriptRaw.basicMajorCredits),
            requiredGeneralEducationCredits: n(transcriptRaw.requiredGeneralEducationCredits),
            electiveGeneralEducationCredits: n(transcriptRaw.electiveGeneralEducationCredits),
            transferredMajorCredits: n(transcriptRaw.transferredMajorCredits),
            totalTransferredCredits: n(transcriptRaw.totalTransferredCredits),
            otherEarnedCredits: n(transcriptRaw.otherEarnedCredits),

            completedCourseNumbers: completed,

            // 선택 필드(있으면 전송)
            totalMajorCredits: n(transcriptRaw.totalMajorCredits),
            totalGeneralEducationCredits: n(transcriptRaw.totalGeneralEducationCredits),
            totalCreditsValid: b(transcriptRaw.totalCreditsValid, true),
            majorCreditsValid: b(transcriptRaw.majorCreditsValid, true),
            generalEducationCreditsValid: b(transcriptRaw.generalEducationCreditsValid, true),
        },
        studentId: String(ctx?.studentId || ""),
        department: String(ctx?.department || ""),
        english: {
            testType: String(englishRaw.testType || ""),
            gradeScore: englishRaw.gradeScore || "",
            numericScore:
                englishRaw.numericScore !== "" && englishRaw.numericScore != null
                    ? Number(englishRaw.numericScore)
                    : undefined,
            passed: englishRaw.passed ?? true,
        },
    };
}

/** 응답 → 뷰모델(화면에서 쓰기 좋은 구조) */
export function mapGraduationCheckResponse(res) {
    const dataArr = (res?.data && Array.isArray(res.data) ? res.data : res?.data?.data) || [];
    const first =
        Array.isArray(dataArr) && dataArr.length > 0 ? dataArr[0] : (Array.isArray(res?.data) ? res.data[0] : res?.data);

    if (!first) return null;

    const credit = first.creditStatus || {};
    const remainingCourses = Array.isArray(first.remainingCourses) ? first.remainingCourses : [];

    // remainingCoreType 구조 방어
    let remainingCoreTypes = [];
    if (Array.isArray(first.remainingCoreTypes)) {
        if (typeof first.remainingCoreTypes[0] === "string") {
            remainingCoreTypes = first.remainingCoreTypes;
        } else {
            const flat = [];
            first.remainingCoreTypes.forEach((x) => {
                if (!x) return;
                if (Array.isArray(x)) flat.push(...x);
                else if (typeof x === "object") flat.push(...Object.keys(x));
            });
            remainingCoreTypes = Array.from(new Set(flat));
        }
    }

    return {
        graduated: !!first.graduated,
        englishPassed: !!first.englishPassed,
        credit: {
            creditPassed: !!credit.creditPassed,
            missingRequiredMajorCredits: Number(credit.missingRequiredMajorCredits || 0),
            missingElectiveMajorCredits: Number(credit.missingElectiveMajorCredits || 0),
            missingRequiredGeneralCredits: Number(credit.missingRequiredGeneralCredits || 0),
            missingElectiveGeneralCredits: Number(credit.missingElectiveGeneralCredits || 0),
            missingTotalCredits: Number(credit.missingTotalCredits || 0),
        },
        remainingCourses,
        remainingCoreTypes,
    };
}
