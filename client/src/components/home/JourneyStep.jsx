import Card from "../common/Card";

function JourneyStep({ icon: Icon, title, description }) {
  return (
    <Card>
      <div className="flex items-center gap-4">

        <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
          <Icon className="w-7 h-7 text-blue-600" />
        </div>

        <div>
          <h3 className="text-xl font-semibold text-slate-800">
            {title}
          </h3>

          <p className="text-slate-600 mt-2">
            {description}
          </p>
        </div>

      </div>
    </Card>
  );
}

export default JourneyStep;