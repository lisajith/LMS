import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  Star,
} from "lucide-react";

function AssignmentStats({

  total,
  pending,
  submitted,
  reviewed,

}) {

  const cards = [

    {
      title: "Total",
      value: total,
      icon: ClipboardList,
      color: "text-blue-500",
      bg: "bg-blue-100 dark:bg-blue-900/20",
    },

    {
      title: "Pending",
      value: pending,
      icon: Clock3,
      color: "text-yellow-500",
      bg: "bg-yellow-100 dark:bg-yellow-900/20",
    },

    {
      title: "Submitted",
      value: submitted,
      icon: CheckCircle2,
      color: "text-green-500",
      bg: "bg-green-100 dark:bg-green-900/20",
    },

    {
      title: "Reviewed",
      value: reviewed,
      icon: Star,
      color: "text-purple-500",
      bg: "bg-purple-100 dark:bg-purple-900/20",
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

              <p className="text-theme-muted">

                {card.title}

              </p>

              <h2 className="text-4xl font-bold mt-2">

                {card.value}

              </h2>

            </div>

            <div className={`p-4 rounded-xl ${card.bg}`}>

              <Icon
                size={30}
                className={card.color}
              />

            </div>

          </div>

        );

      })}

    </div>

  );

}

export default AssignmentStats;