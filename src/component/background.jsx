import logo from "../assets/inha_logo.svg";

export default function BackGround({ children }) {
  return (
    <div className="bg-[#005BAC] w-screen h-screen relative">
      {/* 로고 */}
      <img
        src={logo}
        alt="Inha Logo"
        className="
          fixed top-4 left-4 
          w-16 sm:w-20 md:w-24 lg:w-28 
          h-auto
        "
      />

      {/* 제목 */}
      <h1
        className="
          fixed top-12 left-1/2 -translate-x-1/2 
          text-white font-bold 
          text-2xl sm:text-3xl md:text-4xl lg:text-5xl
        "
      >
        졸업요건확인
      </h1>

      {children}
    </div>
  );
}




