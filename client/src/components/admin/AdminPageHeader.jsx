function AdminPageHeader({
  icon,
  title,
  description,
  action,
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-theme bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-xl">
      {/* Background glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />

      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">
            {icon}
          </div>

          <div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
              {title}
            </h1>

            <p className="mt-2 text-blue-100 max-w-2xl leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {action && (
          <div className="shrink-0">{action}</div>
        )}
      </div>
    </div>
  );
}

export default AdminPageHeader;