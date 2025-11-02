import {useEffect, useMemo} from "react";
import {useLocation, useNavigate} from "react-router-dom";

import BackGround from "../component/background";
import ShowResultBox from "../component/showresultbox";
import {useGraduationCheck} from "../hooks/useGraduationCheck";

export default function Result() {
    const navigate = useNavigate();
    const {state} = useLocation();

    const ctx = state?.context || {};
    const {loading, err, payload, view, execute} = useGraduationCheck();

    useEffect(() => {
        if (!ctx?.parsed) {
            alert("이전 단계 정보가 부족합니다. 처음으로 이동합니다.");
            navigate("/", {replace: true});
            return;
        }
        execute(ctx).catch(() => {});
    }, []);

    const payloadSummary = useMemo(() => {
        if (!payload) return {studentId: "", department: "", english: {}, transcript: {}};
        return {
            studentId: payload.studentId,
            department: payload.department,
            english: {
                testType: payload.english.testType,
                numericScore: payload.english.numericScore,
                gradeScore: payload.english.gradeScore,
            },
            transcript: {
                gpa: payload.transcript.gpa,
                totalCredits: payload.transcript.totalCredits,
            },
        };
    }, [payload]);

    return (
        <BackGround>
            <div
                className="
                    fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                    w-[90vw] sm:w-[70vw] md:w-[50vw] lg:w-[40vw] xl:w-[35vw]
                    max-h-[85vh]
                    flex flex-col items-center justify-start
                    p-3 sm:p-4 md:p-6 gap-2
                    overflow-y-auto rounded-2xl
                    scale-90 sm:scale-95 md:scale-100
                    transition-transform duration-300
                "
            >
                <ShowResultBox
                    loading={loading}
                    err={err}
                    view={view}
                    payloadSummary={payloadSummary}
                    onBack={() => navigate(-1)}
                    onHome={() => navigate("/")}
                />
            </div>
        </BackGround>
    );
}

