import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";

import ThemeSwitcher from "./ThemeSwitcher";

import {
  Palette,
  LockKeyhole,
  LogOut,
  ChevronRight,
} from "lucide-react";

function AccountSettings() {
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut(auth);
    navigate("/");
  }

  return (
    <div className="card-theme rounded-2xl shadow-md p-8">

      <h2 className="text-2xl font-bold text-theme mb-8">
        Account Settings
      </h2>

      {/* Appearance */}

      <div className="mb-10">

        <div className="flex items-center gap-3 mb-5">

          <Palette
            size={22}
            className="primary-text"
          />

          <h3 className="text-lg font-semibold text-theme">
            Appearance
          </h3>

        </div>

        <p className="text-sm text-theme-muted mb-5">
          Customize how your LMS looks.
        </p>

        <ThemeSwitcher />

      </div>

      {/* Security */}

      <div className="border-t border-theme pt-6">

        <button className="w-full flex items-center justify-between rounded-xl p-4 hover-theme transition">

          <div className="flex items-center gap-4">

            <LockKeyhole
              size={20}
              className="primary-text"
            />

            <div className="text-left">

              <p className="font-medium text-theme">
                Change Password
              </p>

              <p className="text-sm text-theme-muted">
                Update your account password
              </p>

            </div>

          </div>

          <ChevronRight
            size={18}
            className="text-theme-muted"
          />

        </button>

      </div>

      {/* Account */}

      <div className="border-t border-theme mt-6 pt-6">

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between rounded-xl p-4 hover:bg-red-200 dark:hover:bg-red-900 transition"
        >

          <div className="flex items-center gap-4">

            <LogOut
              size={20}
              className="text-red-500"
            />

            <div className="text-left">

              <p className="font-medium text-red-500">
                Logout
              </p>

              <p className="text-sm text-theme-muted">
                Sign out of your account
              </p>

            </div>

          </div>

        </button>

      </div>

    </div>
  );
}

export default AccountSettings;