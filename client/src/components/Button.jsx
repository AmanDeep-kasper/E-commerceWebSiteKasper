import { twMerge } from "tailwind-merge";

function Button({
  children,
  className = "",
  variant = "outline",
  onClick,
  type = "button",
}) {
  // base styles
  const base =
    "px-4 sm:px-6 lg:px-8 py-2 sm:py-1.5 lg:py-2 rounded-full text-sm sm:text-base lg:text-lg transition-colors";

  // width handling → full on mobile, auto on tablet/desktop
  const width = "w-full sm:w-auto";

  // variant styles
  const variants = {
    outline:
      "border border-[#212121] text-[#212121] bg-white hover:bg-gray-100",
    solid: "bg-[#212121] text-white hover:bg-[#000000]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={twMerge(base, width, variants[variant], className)}
    >
      {children}
    </button>
  );
}

export default Button;
