import { useState } from "react";
import { Edit2, Check, X } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";

import { db } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";

function EditableField({
  label,
  field,
  value,
  type = "text",
}) {
  const { user, userData, setUserData } = useAuth();

  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(value || "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    try {
      setSaving(true);

      await updateDoc(doc(db, "users", user.uid), {
        [field]: input,
      });

      setUserData({
        ...userData,
        [field]: input,
      });

      setEditing(false);
    } catch (err) {
      console.log(err);
    }

    setSaving(false);
  }

  function handleCancel() {
    setInput(value || "");
    setEditing(false);
  }

  return (
    <div className="flex justify-between items-start border-b border-theme py-5 gap-6">

      <div>
        <p className="text-sm text-theme-muted">
          {label}
        </p>

        {!editing ? (
          <p className="mt-1 font-medium text-theme">
            {value || "-"}
          </p>
        ) : (
          <input
            type={type}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="
              mt-2
              w-80
              px-3
              py-2
              rounded-lg
              card-theme
              border
              border-theme
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />
        )}
      </div>

      {!editing ? (
        <button
          onClick={() => setEditing(true)}
          className="text-blue-600 hover:text-blue-700"
        >
          <Edit2 size={18} />
        </button>
      ) : (
        <div className="flex gap-2">

          <button
            disabled={saving}
            onClick={handleSave}
            className="text-green-600"
          >
            <Check size={18} />
          </button>

          <button
            onClick={handleCancel}
            className="text-red-600"
          >
            <X size={18} />
          </button>

        </div>
      )}

    </div>
  );
}

export default EditableField;