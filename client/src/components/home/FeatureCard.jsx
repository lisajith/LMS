import Card from "../common/Card";

function FeatureCard({
  icon: Icon,
  title,
  description,
}) {
  return (
    <Card>

      <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{background:"color-mix(in srgb,var(--primary) 15%,white)"}}>
        <Icon className="w-7 h-7" style={{color:"var(--primary)"}}/>
      </div>

      <h3 className="text-2xl font-semibold text-theme mb-3">
        {title}
      </h3>

      <p className="text-theme-muted leading-7">
        {description}
      </p>

    </Card>
  );
}

export default FeatureCard;