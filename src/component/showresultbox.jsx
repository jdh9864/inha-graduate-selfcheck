import CommonButton from "./commonbutton";

export default function ShowResultBox({
                                          loading, err, view, payloadSummary, onBack, onHome,
                                      }) {
    return (<div className="absolute inset-0 p-6 flex flex-col gap-4 text-white">
        <div className="text-3xl font-bold">진단 결과</div>

        {/* 상단: 제출 페이로드 요약 */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <div className="font-semibold mb-2">제출한 정보 요약</div>
            <div className="text-sm whitespace-pre-wrap break-all">
                <strong>학생</strong> — {payloadSummary.studentId} / {payloadSummary.department || "-"}{" "}
                <span className="ml-2">|</span>{" "}
                <strong>영어</strong> — {payloadSummary.english.testType}
                {payloadSummary.english.numericScore != null && ` ${payloadSummary.english.numericScore}`}
                {payloadSummary.english.gradeScore && ` (${payloadSummary.english.gradeScore})`}
            </div>
            <div className="text-xs opacity-80 mt-2">
                GPA: {payloadSummary.transcript.gpa} / 총이수: {payloadSummary.transcript.totalCredits}
            </div>
        </div>

        {/* 본문: 결과 렌더 */}
        <div className="bg-white rounded-xl p-4 text-gray-900">
            {loading && <div>진단 중…</div>}
            {err && <div className="text-red-600">{err}</div>}

            {!loading && !err && view && (<div className="flex flex-col gap-6">
                {/* 합격/영어/학점 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Stat title="졸업요건 충족" value={view.graduated ? "예" : "아니오"} ok={view.graduated}/>
                    <Stat title="영어요건 충족" value={view.englishPassed ? "예" : "아니오"} ok={view.englishPassed}/>
                    <Stat title="학점요건 충족" value={view.credit.creditPassed ? "예" : "아니오"}
                          ok={view.credit.creditPassed}/>
                </div>

                {/* 부족 학점 */}
                <div>
                    <div className="font-semibold mb-2">부족 학점</div>
                    <table className="w-full text-sm border">
                        <tbody>
                        <Row name="전공 필수" value={view.credit.missingRequiredMajorCredits}/>
                        <Row name="전공 선택" value={view.credit.missingElectiveMajorCredits}/>
                        <Row name="교양 필수" value={view.credit.missingRequiredGeneralCredits}/>
                        <Row name="교양 선택" value={view.credit.missingElectiveGeneralCredits}/>
                        <Row name="총 학점" value={view.credit.missingTotalCredits}/>
                        </tbody>
                    </table>
                </div>

                {/* 미이수 과목 */}
                <div>
                    <div className="font-semibold mb-2">미이수 과목</div>
                    {view.remainingCourses.length === 0 ? (<div className="text-sm text-gray-600">모두 이수했습니다.</div>) : (
                        <ul className="list-disc pl-5 text-sm">
                            {view.remainingCourses.map((c, i) => (<li key={`${c.courseNumber || i}-${i}`}>
                                {c.courseTitle} ({c.courseNumber}) — {c.credits}학점 / {c.courseType}
                            </li>))}
                        </ul>)}
                </div>

                {/* 미이수 핵심교양 타입 */}
                <div>
                    <div className="font-semibold mb-2">미이수 핵심교양</div>
                    {view.remainingCoreType.length === 0 ? (<div className="text-sm text-gray-600">전부 충족했습니다.</div>) : (
                        <div className="flex flex-wrap gap-2">
                            {view.remainingCoreType.map((t) => (
                                <span key={t} className="px-2 py-1 text-xs rounded-full bg-gray-100 border">
                      {t}
                    </span>))}
                        </div>)}
                </div>

                <div className="flex gap-2">
                    <CommonButton onClick={onBack}>뒤로</CommonButton>
                    <CommonButton onClick={onHome}>처음으로</CommonButton>
                </div>
            </div>)}
        </div>
    </div>);
}

/* 내부 소형 컴포넌트 */
function Stat({title, value, ok}) {
    return (
        <div className={`rounded-lg p-3 border ${ok ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
            <div className="text-xs text-gray-500">{title}</div>
            <div className="text-lg font-semibold">{value}</div>
        </div>);
}

function Row({name, value}) {
    return (<tr className="border-t">
        <td className="p-2 w-40 bg-gray-50">{name}</td>
        <td className="p-2">{value}</td>
    </tr>);
}
