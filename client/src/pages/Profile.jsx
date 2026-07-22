import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import ProfileCard from "../components/profile/ProfileCard";
import PersonalInfo from "../components/profile/PersonalInfo";
import AccountSettings from "../components/profile/AccountSettings";

import { useAuth } from "../context/AuthContext";

function Profile() {
  const navigate = useNavigate();
  const { userData } = useAuth();

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-theme">Profile</h1>
          <p className="text-theme-muted mt-1">
            Manage your personal information, profile photo, and account
            settings.
          </p>
        </div>

        {/* Show ONLY for admins */}
        {userData?.role === "admin" && (
          <button
            onClick={() => navigate("/admin")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg"
          >
            <ShieldCheck size={18} />
            Back to Admin Panel
          </button>
        )}
      </div>

      {/* Top Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        <ProfileCard />

        <div className="lg:col-span-2">
          <PersonalInfo />
        </div>
      </div>

      {/* Bottom Section */}
      <div>
        <AccountSettings />
      </div>
    </section>
  );
}

export default Profile;
