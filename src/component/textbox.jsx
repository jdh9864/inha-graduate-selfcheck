import { useState } from "react";

export default function TextBox() {
  const [text, setText] = useState("");

  return (
    <input
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="텍스트를 입력하세요"
      className="border border-gray-400 rounded px-3 py-2 w-full"
    />
  );
}
