import logo from "../assets/inha_logo.svg";

export default function BackGround({ children }) {
  return (
    <div className="bg-[#005BAC] w-screen h-screen relative">
      <img
        src={logo}
        alt="Inha Logo"
        className="absolute top-8 left-8 w-30 h-auto"
      />

      <h1 className="absolute top-16 left-1/2 -translate-x-1/2 text-white text-4xl font-bold">
        졸업요건확인
      </h1>

      {children}
    </div>
  );
}


