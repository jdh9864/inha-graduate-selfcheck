import {useEffect, useMemo, useState} from "react";

/**
 * props:
 *  - value: 서버 파싱 원본 (parsed.data)
 *  - onChange(updated): 수정될 때마다 구조화된 transcript 객체로 콜백
 *  - className: 스타일 보조
 */
export default function TranscriptEditor({value = {}, onChange, className = ""}) {
    // 초기값 세팅: pga가 오면 gpa에 반영해 표시
    const init = useMemo(() => ({
        totalCredits: toNum(value.totalCredits),
        requiredMajorCredits: toNum(value.requiredMajorCredits),
        electiveMajorCredits: toNum(value.electiveMajorCredits),
        basicMajorCredits: toNum(value.basicMajorCredits),
        requiredGeneralEducationCredits: toNum(value.requiredGeneralEducationCredits),
        electiveGeneralEducationCredits: toNum(value.electiveGeneralEducationCredits),
        transferredMajorCredits: toNum(value.transferredMajorCredits),
        totalTransferredCredits: toNum(value.totalTransferredCredits),
        otherEarnedCredits: toNum(value.otherEarnedCredits),
        gpa: toFloat(value.gpa ?? value.pga, 0), // pga → gpa
        completedCourseNumbers: Array.isArray(value.completedCourseNumbers) ? value.completedCourseNumbers : [],
    }), [value]);

    const [form, setForm] = useState(init);
    const [courseText, setCourseText] = useState((init.completedCourseNumbers || []).join("\n"));

    useEffect(() => {
        setForm(init);
        setCourseText((init.completedCourseNumbers || []).join("\n"));
    }, [init]);

    // 공통 변경 핸들러
    const update = (patch) => {
        const next = {...form, ...patch};
        setForm(next);
        onChange && onChange(next);
    };

    // 코스 텍스트 입력을 배열로 변환(중복 제거/공백 제거)
    const commitCourses = (txt) => {
        const arr = txt
            .split(/\r?\n|,/)          // 줄바꿈 또는 쉼표
            .map((s) => s.trim())
            .filter(Boolean);
        const uniq = Array.from(new Set(arr));
        setCourseText(uniq.join("\n"));
        update({completedCourseNumbers: uniq});
    };

    return (<div className={`grid grid-cols-1 md:grid-cols-2 gap-4 w-full ${className}`}>
            {/* 좌측: 학점 섹션 */}
            <Section title="학점">
                <NumberField label="총 이수학점 (totalCredits)"
                             value={form.totalCredits}
                             onChange={(v) => update({totalCredits: toNum(v)})}/>
                <NumberField label="전공 필수 (requiredMajorCredits)"
                             value={form.requiredMajorCredits}
                             onChange={(v) => update({requiredMajorCredits: toNum(v)})}/>
                <NumberField label="전공 선택 (electiveMajorCredits)"
                             value={form.electiveMajorCredits}
                             onChange={(v) => update({electiveMajorCredits: toNum(v)})}/>
                <NumberField label="전공 기초 (basicMajorCredits)"
                             value={form.basicMajorCredits}
                             onChange={(v) => update({basicMajorCredits: toNum(v)})}/>
                <NumberField label="교양 필수 (requiredGeneralEducationCredits)"
                             value={form.requiredGeneralEducationCredits}
                             onChange={(v) => update({requiredGeneralEducationCredits: toNum(v)})}/>
                <NumberField label="교양 선택 (electiveGeneralEducationCredits)"
                             value={form.electiveGeneralEducationCredits}
                             onChange={(v) => update({electiveGeneralEducationCredits: toNum(v)})}/>
                <NumberField label="편입 전공 인정 (transferredMajorCredits)"
                             value={form.transferredMajorCredits}
                             onChange={(v) => update({transferredMajorCredits: toNum(v)})}/>
                <NumberField label="총 인정 학점 (totalTransferredCredits)"
                             value={form.totalTransferredCredits}
                             onChange={(v) => update({totalTransferredCredits: toNum(v)})}/>
                <NumberField label="기타 취득 (otherEarnedCredits)"
                             value={form.otherEarnedCredits}
                             onChange={(v) => update({otherEarnedCredits: toNum(v)})}/>
            </Section>

            {/* 우측: GPA / 과목목록 */}
            <Section title="평점 & 과목">
                <FloatField label="평점 (gpa)"
                            step="0.01"
                            value={form.gpa}
                            onChange={(v) => update({gpa: toFloat(v, 0)})}/>

                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-700">이수 과목번호 (completedCourseNumbers)</label>
                    <textarea
                        className="border rounded p-2 h-48"
                        placeholder={"한 줄에 하나씩\n예) AIE2004\nCSE1010\nMAT1001"}
                        value={courseText}
                        onChange={(e) => setCourseText(e.target.value)}
                        onBlur={(e) => commitCourses(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                        줄바꿈 또는 쉼표(,)로 구분. 포커스 아웃 시 반영됩니다.
                    </p>
                </div>
            </Section>
        </div>);
}

/* ───────── helpers / subcomponents ───────── */

function Section({title, children}) {
    return (<div className="bg-white rounded-xl border p-4 shadow-sm">
            <div className="font-semibold mb-3">{title}</div>
            <div className="grid grid-cols-1 gap-3">{children}</div>
        </div>);
}

function NumberField({label, value, onChange}) {
    return (<div className="flex items-center gap-2">
            <span className="w-56 text-sm text-gray-700">{label}</span>
            <input
                type="number"
                inputMode="numeric"
                className="border rounded p-2 flex-1"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                min={0}
            />
        </div>);
}

function FloatField({label, value, onChange, step = "0.1"}) {
    return (<div className="flex items-center gap-2">
            <span className="w-56 text-sm text-gray-700">{label}</span>
            <input
                type="number"
                inputMode="decimal"
                step={step}
                className="border rounded p-2 flex-1"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                min={0}
            />
        </div>);
}

function toNum(v, d = 0) {
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? n : d;
}

function toFloat(v, d = 0) {
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? n : d;
}
