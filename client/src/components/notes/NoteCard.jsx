import { Download, Eye, FileText, CalendarDays, BookOpen } from "lucide-react";

function NoteCard({ note }) {
  const formattedDate =
    note.updatedAt?.toDate?.().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }) || "Recently Updated";

  return (
    <div className="card-theme rounded-2xl shadow-md p-6 hover:-translate-y-1 transition duration-300">
      {" "}
      <div className="flex justify-between items-start">
        {" "}
        <div>
          {" "}
          <div className="flex items-center gap-2">
            {" "}
            <BookOpen size={24} className="primary-text" />
            <h2 className="text-2xl font-bold">{note.title}</h2>
          </div>
          <p className="text-theme-muted mt-2">Lesson Notes</p>
        </div>
        <FileText size={36} className="primary-text" />
      </div>
      <div className="mt-6">
        <p className="font-semibold">Course ID</p>

        <p className="text-theme-muted mt-1">{note.courseId}</p>
      </div>
      <div className="mt-6">
        <p className="font-semibold">Last Updated</p>

        <div className="flex items-center gap-2 mt-1 text-theme-muted">
          <CalendarDays size={18} className="primary-text" />

          <span>{formattedDate}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-8">
        <a
          href={note.notesUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl border border-theme py-3 hover-theme transition"
        >
          <Eye size={18} />
          Preview
        </a>

        <a
          href={note.notesUrl}
          download
          className="flex items-center justify-center gap-2 rounded-xl btn-primary py-3"
        >
          <Download size={18} />
          Download
        </a>
      </div>
    </div>
  );
}

export default NoteCard;
