import Card from "../common/Card";

function JourneyStep({ icon: Icon, title, description }) {
  return (
    <Card>
      <div className="flex items-center gap-4">

        <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{background:"color-mix(in srgb,var(--primary) 15%,white)"}}>
          <Icon className="w-7 h-7" style={{color:"var(--primary)"}}/>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-theme">
            {title}
          </h3>

          <p className="text-theme-muted mt-2">
            {description}
          </p>
        </div>

      </div>
    </Card>
  );
}

export default JourneyStep;