import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const data = [
  {
    name: "Present",
    value: 22,
  },
  {
    name: "Absent",
    value: 2,
  },
];

const COLORS = [
  "#22c55e",
  "#ef4444",
];

function DashboardAttendance() {
  const total = data.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const percentage = Math.round(
    (data[0].value / total) * 100
  );

  return (
    <div className="card-theme rounded-2xl shadow p-6">

      <h2 className="text-2xl font-bold mb-6">
        Attendance
      </h2>

      <div className="h-72 relative">

        <ResponsiveContainer>

          <PieChart>

            <Tooltip
              formatter={(value, name) => [
                `${value} Days`,
                name,
              ]}
            />

            <Pie
              data={data}
              dataKey="value"
              innerRadius={72}
              outerRadius={98}
              paddingAngle={4}
              cornerRadius={8}
              stroke="white"
              strokeWidth={3}
            >

              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                />
              ))}

            </Pie>

          </PieChart>

        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col justify-center items-center">

          <h2 className="text-4xl font-bold">
            {percentage}%
          </h2>

          <p className="text-theme-muted">
            Attendance
          </p>

        </div>

      </div>

      <div className="space-y-4 mt-6">

        <div className="flex justify-between items-center">

          <div className="flex items-center gap-3">

            <span className="w-3 h-3 rounded-full bg-green-500"></span>

            <span>
              Present
            </span>

          </div>

          <span className="font-semibold">
            {data[0].value}
          </span>

        </div>

        <div className="flex justify-between items-center">

          <div className="flex items-center gap-3">

            <span className="w-3 h-3 rounded-full bg-red-500"></span>

            <span>
              Absent
            </span>

          </div>

          <span className="font-semibold">
            {data[1].value}
          </span>

        </div>

      </div>

    </div>
  );
}

export default DashboardAttendance;