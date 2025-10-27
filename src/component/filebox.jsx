import {useState} from "react";

export default function FileBox({className = "", name = "multipartFile", accept = "application/pdf", onFileSelected,}) {
    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        const f = e.target.files?.[0] ?? null;
        setFile(f);
        if (onFileSelected) onFileSelected(f);
    };

    return (<div className={`flex flex-col gap-4 items-center justify-center h-screen ${className}`}>
        <input
            type="file"
            accept={accept}
            name={name}
            onChange={handleChange}
            className="border border-gray-400 rounded px-3 py-2 w-64"
        />
        {file && <p>선택한 파일: {file.name}</p>}
    </div>);
}
