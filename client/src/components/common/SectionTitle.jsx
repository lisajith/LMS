function SectionTitle({
  badge,
  title,
  subtitle,
}) {
  return (
    <div className="text-center mb-16">

      {badge && (
        <p className="text-blue-600 font-semibold uppercase tracking-wider">
          {badge}
        </p>
      )}

      <h2 className="mt-3 text-4xl font-bold text-theme">
        {title}
      </h2>

      <p className="mt-4 text-lg text-theme-muted max-w-2xl mx-auto">
        {subtitle}
      </p>

    </div>
  );
}

export default SectionTitle;