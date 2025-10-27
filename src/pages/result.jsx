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
        execute(ctx).catch(() => {
        });
    }, []);

    const payloadSummary = useMemo(() => {
        if (!payload) return {studentId: "", department: "", english: {}, transcript: {}};
        return {
            studentId: payload.studentId, department: payload.department, english: {
                testType: payload.english.testType,
                numericScore: payload.english.numericScore,
                gradeScore: payload.english.gradeScore,
            }, transcript: {
                gpa: payload.transcript.gpa, totalCredits: payload.transcript.totalCredits,
            },
        };
    }, [payload]);

    return (<BackGround>
        <ShowResultBox
            loading={loading}
            err={err}
            view={view}
            payloadSummary={payloadSummary}
            onBack={() => navigate(-1)}
            onHome={() => navigate("/")}
        />
    </BackGround>);
}
