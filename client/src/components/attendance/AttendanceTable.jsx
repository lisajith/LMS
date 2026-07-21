import { CalendarDays, CheckCircle2, XCircle } from "lucide-react";

const attendance = [
  {
    id: 1,
    date: "17 Jul 2026",
    course: "Java Programming",
    status: "Present",
  },
  {
    id: 2,
    date: "16 Jul 2026",
    course: "Python Programming",
    status: "Present",
  },
  {
    id: 3,
    date: "15 Jul 2026",
    course: "HTML & CSS",
    status: "Absent",
  },
  {
    id: 4,
    date: "14 Jul 2026",
    course: "JavaScript",
    status: "Present",
  },
  {
    id: 5,
    date: "13 Jul 2026",
    course: "Java Programming",
    status: "Present",
  },
];

function AttendanceTable() {
  return (
    <div className="card-theme rounded-2xl shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Attendance History</h2>

      <div className="space-y-4">
        {attendance.map((item) => (
          <div
            key={item.id}
            className="
              flex
              justify-between
              items-center
              rounded-xl
              border
              border-theme
              p-5
              hover-theme
              transition
            "
          >
            <div>
              <h3 className="font-semibold text-lg">{item.course}</h3>

              <div className="flex items-center gap-2 mt-1 text-theme-muted">
                <CalendarDays size={16} />

                {item.date}
              </div>
            </div>

            {item.status === "Present" ? (
              <div
                className="
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  rounded-full
                  bg-green-100
                  text-green-700
                  dark:bg-green-900/30
                  dark:text-green-400
                "
              >
                <CheckCircle2 size={18} />
                Present
              </div>
            ) : (
              <div
                className="
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  rounded-full
                  bg-red-100
                  text-red-700
                  dark:bg-red-900/30
                  dark:text-red-400
                "
              >
                <XCircle size={18} />
                Absent
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AttendanceTable;
