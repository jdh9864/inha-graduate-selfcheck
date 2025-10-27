export default function CommonButton({ className, onClick, children }) {
  return (
    <button
      className={`
        px-16 py-2 rounded-lg font-semibold text-lg
        transition-colors duration-200
        bg-blue-500 text-white hover:bg-blue-600
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </button>
  );
}


