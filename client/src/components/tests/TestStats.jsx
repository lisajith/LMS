import { ClipboardCheck, PlayCircle, Clock3, CheckCircle2 } from "lucide-react";

function TestStats({ tests }) {
  const now = new Date();

  let active = 0;
  let upcoming = 0;
  let ended = 0;

  function parseDate(value) {
    if (!value) return null;

    if (typeof value.toDate === "function") {
      return value.toDate();
    }

    if (value.seconds) {
      return new Date(value.seconds * 1000);
    }

    if (value instanceof Date) {
      return value;
    }

    return new Date(value);
  }

  tests.forEach((test) => {
    const start = test.startDate?.toDate
      ? test.startDate.toDate()
      : new Date(test.startDate);

    const end = test.endDate?.toDate
      ? test.endDate.toDate()
      : new Date(test.endDate);

    if (!start || !end || isNaN(start) || isNaN(end)) return;

    if (start && now < start) {
      upcoming++;
    } else if (end && now > end) {
      ended++;
    } else {
      active++;
    }
  });

  const cards = [
    {
      title: "Total Tests",
      value: tests.length,
      icon: ClipboardCheck,
      color: "text-blue-500",
      bg: "bg-blue-100 dark:bg-blue-900/20",
    },

    {
      title: "Active",
      value: active,
      icon: PlayCircle,
      color: "text-green-500",
      bg: "bg-green-100 dark:bg-green-900/20",
    },

    {
      title: "Upcoming",
      value: upcoming,
      icon: Clock3,
      color: "text-yellow-500",
      bg: "bg-yellow-100 dark:bg-yellow-900/20",
    },

    {
      title: "Ended",
      value: ended,
      icon: CheckCircle2,
      color: "text-red-500",
      bg: "bg-red-100 dark:bg-red-900/20",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="card-theme rounded-2xl shadow p-6 flex justify-between items-center"
          >
            <div>
              <p className="text-theme-muted">{card.title}</p>

              <h2 className="text-4xl font-bold mt-2">{card.value}</h2>
            </div>

            <div className={`p-4 rounded-xl ${card.bg}`}>
              <Icon size={30} className={card.color} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TestStats;
