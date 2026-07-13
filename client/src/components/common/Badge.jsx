function Badge({ children }) {
  return (
    <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
      {children}
    </span>
  );
}

export default Badge;