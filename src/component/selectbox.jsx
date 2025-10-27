import {useEffect, useMemo, useState} from "react";
import {EnglishAPI} from "../lib/api";
import {ENGLISH_LABELS, FALLBACK_TYPES, toOptions, TYPE_RULES} from "../constants/englishrules";

export default function SelectBox({
                                      className = "",
                                      name = "englishType",
                                      onSelect,
                                      onChangeDetail,
                                      defaultValue = "",
                                      nameNumeric = "englishNumericScore",
                                      nameGrade = "englishGradeScore",
                                  }) {
    const [selected, setSelected] = useState(defaultValue);
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const [numericScore, setNumericScore] = useState("");
    const [gradeScore, setGradeScore] = useState("");

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                setErr("");
                const res = await EnglishAPI.listTypes();
                const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
                const usable = (list || []).filter(Boolean);
                if (!mounted) return;
                const opts = usable.length ? usable : FALLBACK_TYPES;
                setTypes(opts);

                const init = defaultValue || opts[0] || "";
                setSelected(init);
                onSelect && onSelect(init);
                setNumericScore("");
                setGradeScore("");
                onChangeDetail && onChangeDetail({testType: init, numericScore: "", gradeScore: ""});
            } catch {
                if (!mounted) return;
                setErr("영어 시험 목록을 불러오지 못했습니다. 기본 옵션으로 표시합니다.");
                setTypes(FALLBACK_TYPES);
                const init = defaultValue || FALLBACK_TYPES[0];
                setSelected(init);
                onSelect && onSelect(init);
                setNumericScore("");
                setGradeScore("");
                onChangeDetail && onChangeDetail({testType: init, numericScore: "", gradeScore: ""});
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        if (defaultValue) {
            setSelected(defaultValue);
            onSelect && onSelect(defaultValue);
            setNumericScore("");
            setGradeScore("");
            onChangeDetail && onChangeDetail({testType: defaultValue, numericScore: "", gradeScore: ""});
        }
    }, [defaultValue]);

    const options = useMemo(() => toOptions(types), [types]);
    const rule = TYPE_RULES[selected] || null;

    const handleTypeChange = (val) => {
        setSelected(val);
        onSelect && onSelect(val);
        setNumericScore("");
        setGradeScore("");
        onChangeDetail && onChangeDetail({testType: val, numericScore: "", gradeScore: ""});
    };

    const handleNumericChange = (val) => {
        setNumericScore(val);
        onChangeDetail && onChangeDetail({testType: selected, numericScore: val, gradeScore});
    };

    const handleGradeChange = (val) => {
        setGradeScore(val);
        onChangeDetail && onChangeDetail({testType: selected, numericScore, gradeScore: val});
    };

    return (<div className={`flex flex-col items-center justify-center h-screen gap-4 ${className}`}>
        {/* 시험 타입 선택 */}
        <select
            name={name}
            value={selected}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="border p-2 rounded w-64"
            disabled={loading}
        >
            {options.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
        </select>

        {/* 타입별 점수/등급 입력 */}
        {rule && (<div className="w-64 flex flex-col gap-2">
            {/* 숫자만 입력 */}
            {rule.kind === "numeric" && (<input
                type="number"
                name={nameNumeric}
                inputMode="decimal"
                min={rule.min}
                max={rule.max}
                step={rule.step}
                placeholder={rule.placeholder}
                value={numericScore}
                onChange={(e) => handleNumericChange(e.target.value)}
                className="border p-2 rounded w-full"
            />)}

            {/* 등급만 선택 (드롭다운 전용) */}
            {rule.kind === "grade" && (<select
                name={nameGrade}
                value={gradeScore}
                onChange={(e) => handleGradeChange(e.target.value)}
                className="border p-2 rounded w-full"
            >
                <option value="">등급 선택</option>
                {(rule.grades || []).map((g) => (<option key={g} value={g}>{g}</option>))}
            </select>)}

            {/* 숫자 + 레벨(예: TOEIC Speaking) */}
            {rule.kind === "numeric+grade" && (<>
                <input
                    type="number"
                    name={nameNumeric}
                    inputMode="decimal"
                    min={rule.min}
                    max={rule.max}
                    step={rule.step}
                    placeholder={rule.placeholder}
                    value={numericScore}
                    onChange={(e) => handleNumericChange(e.target.value)}
                    className="border p-2 rounded w-full"
                />
                <select
                    name={nameGrade}
                    value={gradeScore}
                    onChange={(e) => handleGradeChange(e.target.value)}
                    className="border p-2 rounded w-full"
                >
                    <option value="">레벨 선택</option>
                    {(rule.levels || []).map((lv) => (<option key={lv} value={lv}>{lv}</option>))}
                </select>
            </>)}
        </div>)}

        {loading && <p className="text-xs text-gray-500">불러오는 중…</p>}
        {err && <p className="text-xs text-red-500">{err}</p>}
        {selected && (<p className="text-sm">
            선택한 옵션: {ENGLISH_LABELS[selected] || selected}
        </p>)}
    </div>);
}
