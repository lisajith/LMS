import { useTheme } from "../../context/ThemeContext";

const themes = [
  {
    name: "Light",
    value: "light",
    color: "card-theme border",
  },
  {
    name: "Dark",
    value: "dark",
    color: "bg-slate-900",
  },
  {
    name: "Ocean",
    value: "blue",
    color: "bg-blue-600",
  },
  {
    name: "Purple",
    value: "purple",
    color: "bg-purple-600",
  },
  {
    name: "Emerald",
    value: "green",
    color: "bg-emerald-600",
  },
];

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div>

      <h3 className="text-lg font-semibold mb-5">
        Choose Theme
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

        {themes.map((item) => (

          <button
            key={item.value}
            onClick={() => setTheme(item.value)}
            className={`rounded-2xl border-2 p-4 transition hover:scale-105 ${
              theme === item.value
                ? "border-blue-600"
                : "border-transparent"
            }`}
          >

            <div
              className={`w-12 h-12 rounded-full mx-auto ${item.color}`}
            ></div>

            <p className="mt-3 font-medium">
              {item.name}
            </p>

          </button>

        ))}

      </div>

    </div>
  );
}

export default ThemeSwitcher;