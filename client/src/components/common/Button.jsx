function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
}) {
  const baseStyles =
    "px-6 py-3 rounded-xl font-medium transition-all duration-300";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105",

    secondary:
      "border border-slate-300 hover:bg-slate-100",

    danger:
      "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

export default Button;