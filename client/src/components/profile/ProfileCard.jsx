import { Camera, LoaderCircle } from "lucide-react";

import { useRef, useState } from "react";

import { doc, updateDoc } from "firebase/firestore";

import { db } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";
import { uploadImage } from "../../utils/uploadImage";

import { toast } from "react-toastify";

function ProfileCard() {
  const { user, userData, setUserData } = useAuth();
  const safePhoto = userData?.photoURL?.replace(/^http:\/\//, "https://");

  const fileInputRef = useRef();

  const [uploading, setUploading] = useState(false);

  async function handleImageChange(e) {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image should be under 5 MB.");
      return;
    }

    setUploading(true);

    try {
      const imageUrl = await uploadImage(file);

      await updateDoc(doc(db, "users", user.uid), {
        photoURL: imageUrl,
      });

      setUserData((prev) => ({
        ...prev,
        photoURL: imageUrl,
      }));

      toast.success("Profile photo updated!");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }

    setUploading(false);
  }

  return (
    <div className="card-theme rounded-3xl shadow-lg border border-theme p-8">
      <div className="flex flex-col items-center">
        {/* Image */}

        <div className="relative group">
          <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden border-4 border-blue-500 shadow-xl">
            {userData?.photoURL ? (
              <img
                src={userData.photoURL?.replace("http://", "https://")}
                alt={userData.name}
                crossOrigin="anonymous"
                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-blue-500 via-indigo-500 to-violet-600 flex items-center justify-center">
                <span className="text-5xl font-bold text-white">
                  {userData?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <input
            hidden
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            disabled={uploading}
            onClick={() => fileInputRef.current.click()}
            className="
              absolute
              bottom-2
              right-2
              w-11
              h-11
              rounded-full
              bg-blue-600
              hover:bg-blue-700
              text-white
              shadow-xl
              flex
              items-center
              justify-center
              transition
              hover:scale-110
              cursor-pointer
            "
          >
            {uploading ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : (
              <Camera size={18} />
            )}
          </button>
        </div>

        {/* Name */}

        <h2 className="mt-5 text-xl sm:text-2xl font-bold text-theme text-center">
          {userData?.name}
        </h2>

        {/* Email */}

        <p className="mt-2 text-theme-muted text-center break-all">
          {userData?.email}
        </p>

        {/* Role */}

        <span className="mt-5 px-5 py-2 rounded-full bg-blue-600/15 border border-blue-500/30 text-blue-600 font-semibold capitalize">
          {userData?.role}
        </span>
      </div>
    </div>
  );
}

export default ProfileCard;
