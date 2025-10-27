import { useCallback, useState } from "react";
import { runGraduationCheck } from "../lib/services/graduation";

export function useGraduationCheck() {
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    const [payload, setPayload] = useState(null);
    const [res, setRes] = useState(null);
    const [view, setView] = useState(null);

    const execute = useCallback(async (context) => {
        try {
            setLoading(true);
            setErr("");
            const { payload, res, view } = await runGraduationCheck(context);
            setPayload(payload);
            setRes(res);
            setView(view);
            return { payload, res, view };
        } catch (e) {
            console.error(e);
            setErr(e?.message || "졸업요건 진단 중 오류");
            throw e;
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, err, payload, res, view, execute };
}
