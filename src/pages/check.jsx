import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";

import BackGround from "../component/background";
import WhiteBox from "../component/whitebox";
import CommonButton from "../component/commonbutton";
import TranscriptEditor from "../component/transcipteditorbox";

export default function Check() {
    const navigate = useNavigate();
    const {state} = useLocation();

    // Home → navigate 시 넣은 context (student/english/parsed)
    const ctx = state?.context || {};
    const parsed = ctx?.parsed;
    const initial = parsed?.data || {};

    const [edited, setEdited] = useState(initial);

    useEffect(() => {
        if (!parsed) {
            alert("이전 단계의 파싱 정보가 없습니다. 처음으로 이동합니다.");
            navigate("/", {replace: true});
        }
    }, []);

    const onConfirm = () => {
        const {pga, ...rest} = edited || {};
        const merged = {
            ...rest,
            gpa: toFloat(edited.gpa ?? pga, 0),
            completedCourseNumbers: Array.from(new Set((edited.completedCourseNumbers || []).map(String).filter(Boolean))),
            totalCredits: toNum(edited.totalCredits),
            requiredMajorCredits: toNum(edited.requiredMajorCredits),
            electiveMajorCredits: toNum(edited.electiveMajorCredits),
            basicMajorCredits: toNum(edited.basicMajorCredits),
            requiredGeneralEducationCredits: toNum(edited.requiredGeneralEducationCredits),
            electiveGeneralEducationCredits: toNum(edited.electiveGeneralEducationCredits),
            transferredMajorCredits: toNum(edited.transferredMajorCredits),
            totalTransferredCredits: toNum(edited.totalTransferredCredits),
            otherEarnedCredits: toNum(edited.otherEarnedCredits),
        };

        const nextContext = {
            ...ctx, parsed: {
                ...parsed, data: merged,
            },
        };

        navigate("/result", {state: {context: nextContext}});
    };

    return (<BackGround>
        <WhiteBox
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[70%] flex flex-col items-center p-4 gap-4 overflow-hidden">
            <div className="text-4xl font-bold mb-2">정보확인</div>

            <div className="w-full overflow-y-auto pr-1">
                <TranscriptEditor
                    value={initial}
                    onChange={setEdited}
                    className="min-w-0"
                />
            </div>

            <CommonButton onClick={onConfirm} className="mt-2 w-full max-w-md">
                확인
            </CommonButton>
        </WhiteBox>
    </BackGround>);
}

/* helpers */
function toNum(v, d = 0) {
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? n : d;
}

function toFloat(v, d = 0) {
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? n : d;
}
