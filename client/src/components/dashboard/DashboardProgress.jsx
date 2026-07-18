import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function DashboardProgress({ data }) {
  const overall =
    data.length > 0
      ? Math.round(
          data.reduce(
            (sum, item) => sum + item.progress,
            0
          ) / data.length
        )
      : 0;

  return (
    <div className="grid lg:grid-cols-3 gap-6">

      {/* Overall Progress */}

      <div className="card-theme rounded-2xl p-6 shadow">

        <h2 className="text-xl font-bold mb-4">
          Overall Progress
        </h2>

        <div className="h-72">

          <ResponsiveContainer>

            <RadialBarChart
              innerRadius="70%"
              outerRadius="100%"
              data={[
                {
                  value: overall,
                },
              ]}
              startAngle={90}
              endAngle={-270}
            >

              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
              />

              <RadialBar
                dataKey="value"
                fill="#2563eb"
                cornerRadius={15}
              />

              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-current text-4xl font-bold"
              >
                {overall}%
              </text>

            </RadialBarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* Course Progress */}

      <div className="lg:col-span-2 card-theme rounded-2xl p-6 shadow">

        <h2 className="text-xl font-bold mb-4">
          Course Progress
        </h2>

        <div className="h-72">

          <ResponsiveContainer>

            <BarChart
              data={data}
            >

              <XAxis
                dataKey="course"
              />

              <YAxis
                domain={[0,100]}
              />

              <Tooltip />

              <Bar
                dataKey="progress"
                fill="#2563eb"
                radius={[10,10,0,0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}

export default DashboardProgress;