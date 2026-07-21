import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../../firebase/firebase";

import { Megaphone, Plus, Trash2, CalendarDays } from "lucide-react";

import toast from "react-hot-toast";
import AdminPageHeader from "../../components/admin/AdminPageHeader";

function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    message: "",
  });

  async function toggleAnnouncement(item) {
    try {
      await updateDoc(doc(db, "announcements", item.id), {
        active: !item.active,
      });

      fetchAnnouncements();

      toast.success(
        item.active ? "Announcement hidden" : "Announcement activated"
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update announcement");
    }
  }

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  async function fetchAnnouncements() {
    try {
      const q = query(
        collection(db, "announcements"),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);

      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setAnnouncements(list);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.title.trim() || !form.message.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await addDoc(collection(db, "announcements"), {
        title: form.title,
        message: form.message,
        active: true, // ADD THIS
        createdAt: serverTimestamp(),
      });

      toast.success("Announcement published");

      setForm({
        title: "",
        message: "",
      });

      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      toast.error("Failed to publish announcement");
    }
  }

  async function handleDelete(id) {
    const ok = window.confirm("Delete this announcement?");

    if (!ok) return;

    try {
      await deleteDoc(doc(db, "announcements", id));

      setAnnouncements((prev) => prev.filter((a) => a.id !== id));

      toast.success("Announcement deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete announcement");
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <AdminPageHeader
        icon={<Megaphone size={30} />}
        title="Student Management"
        description="Publish updates, notices, and important information for students."
      />

      {/* Create Announcement */}
      <form
        onSubmit={handleSubmit}
        className="card-theme rounded-3xl p-6 border border-theme shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Create Announcement</h2>

          <button
            type="submit"
            className="btn-primary px-5 py-3 rounded-xl flex items-center gap-2"
          >
            <Plus size={18} />
            Publish
          </button>
        </div>

        <input
          type="text"
          placeholder="Announcement title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full rounded-xl border border-theme bg-theme p-4"
        />

        <textarea
          rows={5}
          placeholder="Write your announcement message..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full rounded-xl border border-theme bg-theme p-4"
        />
      </form>

      {/* Announcement List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10">Loading announcements...</div>
        ) : announcements.length === 0 ? (
          <div className="card-theme rounded-3xl p-12 text-center border border-theme">
            <Megaphone className="mx-auto text-theme-muted mb-4" size={48} />
            <h3 className="text-xl font-bold">No announcements yet</h3>
            <p className="text-theme-muted mt-2">
              Publish your first announcement to notify students.
            </p>
          </div>
        ) : (
          announcements.map((item) => (
            <div
              key={item.id}
              className="card-theme rounded-3xl p-6 border border-theme shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Megaphone className="text-blue-600" size={18} />
                    <h3 className="text-xl font-bold">{item.title}</h3>
                  </div>

                  <p className="text-theme-muted whitespace-pre-line leading-relaxed">
                    {item.message}
                  </p>

                  <div className="flex items-center gap-2 mt-4 text-sm text-theme-muted">
                    <CalendarDays size={16} />
                    <span>
                      {item.createdAt?.toDate
                        ? item.createdAt.toDate().toLocaleString()
                        : "Just now"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAnnouncement(item)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition ${
                      item.active
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {item.active ? "Active" : "Hidden"}
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminAnnouncements;
