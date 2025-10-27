import {useEffect, useState} from "react";
import {DepartmentAPI} from "../lib/api";

const FALLBACK_DEPTS = ["COMPUTER_SCIENCE", "AI_ENGINEERING", "DATA_SCIENCE"];

export default function Studentinfobox({
                                        className = "",
                                        nameId = "studentId",
                                        nameDept = "department",
                                        defaultStudentId = "",
                                        defaultDepartment = "",
                                        onChange,
                                    }) {
    const [studentId, setStudentId] = useState(defaultStudentId);
    const [department, setDepartment] = useState(defaultDepartment);
    const [depts, setDepts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                setErr("");
                const res = await DepartmentAPI.list();
                const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
                const usable = (list || []).filter(Boolean);
                if (!mounted) return;
                setDepts(usable.length ? usable : FALLBACK_DEPTS);

                // 기본 학과 선택
                const initDept = defaultDepartment || (usable[0] ?? FALLBACK_DEPTS[0]) || "";
                setDepartment((prev) => prev || initDept);
            } catch {
                if (!mounted) return;
                setErr("학과 목록을 불러오지 못했습니다. 기본 옵션으로 표시합니다.");
                setDepts(FALLBACK_DEPTS);
                const initDept = defaultDepartment || FALLBACK_DEPTS[0];
                setDepartment((prev) => prev || initDept);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        onChange && onChange({studentId, department});
    }, [studentId, department, onChange]);

    return (<div className={`flex flex-col items-stretch gap-3 w-full max-w-64 ${className}`}>
        <label className="text-sm text-gray-700">학번</label>
        <input
            name={nameId}
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="예: 12201797"
            className="border p-2 rounded"
        />

        <label className="text-sm text-gray-700 mt-2">학과</label>
        <select
            name={nameDept}
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="border p-2 rounded"
            disabled={loading}
        >
            {depts.map((d) => (<option key={d} value={d}>{d}</option>))}
        </select>

        {loading && <p className="text-xs text-gray-500">불러오는 중…</p>}
        {err && <p className="text-xs text-red-500">{err}</p>}
    </div>);
}
