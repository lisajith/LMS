function Header() {
  return (
    <header className="h-20 bg-white border-b flex items-center justify-between px-8">

      <div>
        <h2 className="text-2xl font-bold">
          Welcome Back 👋
        </h2>

        <p className="text-gray-500">
          Ready to continue your learning?
        </p>
      </div>

      <div className="flex items-center gap-4">

        <button className="text-2xl hover:scale-110 transition">
          🔔
        </button>

        <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
          L
        </div>

      </div>

    </header>
  );
}

export default Header;