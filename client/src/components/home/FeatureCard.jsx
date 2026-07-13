import Card from "../common/Card";

function FeatureCard({
  icon: Icon,
  title,
  description,
}) {
  return (
    <Card>

      <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-6">
        <Icon className="w-7 h-7 text-blue-600" />
      </div>

      <h3 className="text-2xl font-semibold text-slate-800 mb-3">
        {title}
      </h3>

      <p className="text-slate-600 leading-7">
        {description}
      </p>

    </Card>
  );
}

export default FeatureCard;