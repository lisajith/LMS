import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";

import ThemeSwitcher from "./ThemeSwitcher";

import {
  Palette,
  LockKeyhole,
  LogOut,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

function AccountSettings() {
  const navigate = useNavigate();
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  async function handleLogout() {
    await signOut(auth);
    navigate("/");
  }

  return (
    <div className="card-theme rounded-2xl shadow-md p-5 sm:p-6 lg:p-8">
      <h2 className="text-2xl font-bold text-theme mb-8">Account Settings</h2>

      {/* Appearance */}

      <div className="border-b border-theme pb-5">
        <button
          onClick={() => setAppearanceOpen(!appearanceOpen)}
          className="w-full flex items-start sm:items-center justify-between gap-3 rounded-xl p-4 hover-theme transition cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <Palette size={22} className="primary-text" />

            <div className="text-left">
              <h3 className="font-semibold text-theme">Appearance</h3>

              <p className="text-sm text-theme-muted">
                Customize your SyVA experience
              </p>
            </div>
          </div>

          {appearanceOpen ? (
            <ChevronDown size={20} />
          ) : (
            <ChevronRight size={20} />
          )}
        </button>

        {appearanceOpen && (
          <div className="mt-6 pl-10 animate-fadeIn">
            <ThemeSwitcher />
          </div>
        )}
      </div>

      {/* Security */}

      <div className="border-b border-theme py-5">
        <button
          onClick={() => setSecurityOpen(!securityOpen)}
          className="w-full flex items-start sm:items-center justify-between gap-3 rounded-xl p-4 hover-theme transition cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <LockKeyhole size={20} className="primary-text" />

            <div className="text-left">
              <h3 className="font-semibold text-theme">Security</h3>

              <p className="text-sm text-theme-muted">
                Password & account security
              </p>
            </div>
          </div>

          {securityOpen ? (
            <ChevronDown size={20} />
          ) : (
            <ChevronRight size={20} />
          )}
        </button>

        {securityOpen && (
          <div className="mt-5 pl-10">
            <button className="hover-theme rounded-xl p-3 w-full text-left transition cursor-pointer">
              Change Password
            </button>
          </div>
        )}
      </div>

      {/* Account */}

      <div className="pt-5">
        <button
          onClick={() => setAccountOpen(!accountOpen)}
          className="w-full flex items-center justify-between rounded-xl p-4 hover-theme transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <LogOut size={20} className="text-red-500" />

            <div className="text-left">
              <h3 className="font-semibold text-red-500">Account</h3>

              <p className="text-sm text-theme-muted">
                Logout and account actions
              </p>
            </div>
          </div>

          {accountOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>

        {accountOpen && (
          <div className="mt-5 pl-10">
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-5 py-3 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccountSettings;
