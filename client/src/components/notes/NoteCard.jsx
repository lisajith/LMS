import {
  LucideBookOpen,
  Download,
  Eye,
  FileText,
} from "lucide-react";

function NoteCard({ note }) {

  return (

    <div className="card-theme rounded-2xl shadow-md p-6 hover:-translate-y-1 transition">

      <div className="flex justify-between items-start">

        <div>

          <div className="flex items-center gap-2">

            <LucideBookOpen
              size={22}
              className="primary-text"
            />

            <h2 className="text-xl font-bold">

              {note.title}

            </h2>

          </div>

          <p className="mt-2 text-theme-muted">

            {note.courseName}

          </p>

        </div>

        <FileText
          size={34}
          className="primary-text"
        />

      </div>

      <div className="mt-6">

        <p className="text-sm font-semibold">

          Lesson

        </p>

        <p className="text-theme-muted">

          {note.lessonTitle}

        </p>

      </div>

      <div className="mt-5">

        <p className="text-sm font-semibold">

          Description

        </p>

        <p className="text-theme-muted mt-1">

          {note.description}

        </p>

      </div>

      <div className="grid grid-cols-2 gap-3 mt-8">

        <a
          href={note.pdfURL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl border border-theme py-3 hover-theme transition"
        >
          <Eye size={18} />

          Preview

        </a>

        <a
          href={note.pdfURL}
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