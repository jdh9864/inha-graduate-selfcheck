import {useState} from "react";
import {useNavigate} from "react-router-dom";

import BackGround from "../component/background";
import WhiteBox from "../component/whitebox";
import FileBox from "../component/filebox";
import SelectBox from "../component/selectbox";
import Studentinfobox from "../component/studentinfobox.jsx";
import CommonButton from "../component/commonbutton";

import {TranscriptAPI} from "../lib/api";

export default function Home() {
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [englishType, setEnglishType] = useState("");
    const [englishDetail, setEnglishDetail] = useState({
        testType: "",
        numericScore: "",
        gradeScore: "",
    });
    const [student, setStudent] = useState({studentId: "", department: ""});

    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async () => {
        if (!file) return alert("성적표 PDF를 선택해 주세요.");
        if (!englishType) return alert("영어 시험을 선택해 주세요.");
        if (!student.studentId) return alert("학번을 입력해 주세요.");
        if (!student.department) return alert("학과를 선택해 주세요.");

        try {
            setSubmitting(true);

            const parsed = await TranscriptAPI.upload(file);

            navigate("/check", {
                state: {
                    context: {
                        studentId: student.studentId || "",
                        department: student.department || "",
                        english: {
                            testType: englishType,
                            numericScore: englishDetail.numericScore || "",
                            gradeScore: englishDetail.gradeScore || "",
                        },
                        parsed,
                    },
                },
            });
        } catch (e) {
            console.error(e);
            alert("제출 중 오류가 발생했습니다.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <BackGround>
            <WhiteBox
                className="
                    absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                    w-[90%] sm:w-[70%] md:w-[50%] lg:w-[35%] xl:w-[30%]
                    h-auto max-h-[60vh]
                    flex flex-col items-center justify-start
                    p-4 sm:p-6 gap-3 overflow-y-auto rounded-2xl
                "
            >
                <div className="text-xl sm:text-2xl font-bold mb-2 text-center">
                    졸업요건확인
                </div>

                <FileBox onFileSelected={setFile}/>

                <SelectBox
                    onSelect={setEnglishType}
                    onChangeDetail={setEnglishDetail}
                />

                <Studentinfobox onChange={setStudent}/>

                <CommonButton 
                    onClick={onSubmit} 
                    disabled={submitting} 
                    className="mt-2 w-full"
                >
                    {submitting ? "제출 중..." : "제출하기"}
                </CommonButton>
            </WhiteBox>
        </BackGround>
    );
}

