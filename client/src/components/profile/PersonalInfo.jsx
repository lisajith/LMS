import { useEffect, useState } from "react";

import {
  User,
  Phone,
  CalendarDays,
  Save,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import { db } from "../../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";

import { toast } from "react-toastify";

function PersonalInfo() {
  const { user, userData } = useAuth();

  const [form, setForm] = useState({
    name: "",
    countryCode: "+91",
    phone: "",
    gender: "",
    dob: "",
    address: "",
    bio: "",
  });

  useEffect(() => {
    if (userData) {
      setForm({
        name: userData.name || "",
        countryCode: userData.countryCode || "+91",
        phone: userData.phone || "",
        gender: userData.gender || "",
        dob: userData.dob || "",
        address: userData.address || "",
        bio: userData.bio || "",
      });
    }
  }, [userData]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSave() {
    try {
      await updateDoc(doc(db, "users", user.uid), form);

      toast.success("Profile Updated Successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="card-theme rounded-3xl shadow-lg p-8">

      <h2 className="text-3xl font-bold text-theme mb-8">
        Personal Information
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Full Name */}

        <InputField
          icon={<User size={18} />}
          label="Full Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />

        {/* Phone */}

        <div>
          <label className="text-theme-muted flex items-center gap-2 mb-2">
            <Phone size={18} />
            Phone Number
          </label>

          <div className="flex gap-3">

            <select
              name="countryCode"
              value={form.countryCode}
              onChange={handleChange}
              className="card-theme rounded-xl px-3"
            >
              <option value="+91">🇮🇳 +91</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+61">🇦🇺 +61</option>
              <option value="+971">🇦🇪 +971</option>
              <option value="+81">🇯🇵 +81</option>
              <option value="+49">🇩🇪 +49</option>
              <option value="+65">🇸🇬 +65</option>
            </select>

            <input
              type="tel"
              name="phone"
              placeholder="9876543210"
              value={form.phone}
              onChange={handleChange}
              className="flex-1 card-theme rounded-xl p-3"
            />

          </div>
        </div>

        {/* DOB */}

        <InputField
          icon={<CalendarDays size={18} />}
          label="Date of Birth"
          type="date"
          name="dob"
          value={form.dob}
          onChange={handleChange}
        />

        {/* Gender */}

        <div>

          <label className="text-theme-muted block mb-2">
            Gender
          </label>

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full card-theme rounded-xl p-3"
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

        </div>

      </div>

      {/* Address */}

      <div className="mt-6">

        <label className="text-theme-muted block mb-2">
          Address
        </label>

        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Enter your address"
          className="w-full card-theme rounded-xl p-3"
        />

      </div>

      {/* Bio */}

      <div className="mt-6">

        <label className="text-theme-muted block mb-2">
          Bio
        </label>

        <textarea
          rows={4}
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself..."
          className="w-full card-theme rounded-xl p-3 resize-none"
        />

      </div>

      {/* Save Button */}

      <button
        onClick={handleSave}
        className="btn-primary mt-8 px-6 py-3 rounded-xl flex items-center gap-2 hover:scale-105 transition"
      >
        <Save size={18} />
        Save Changes
      </button>

    </div>
  );
}

function InputField({
  icon,
  label,
  ...props
}) {
  return (
    <div>

      <label className="text-theme-muted flex items-center gap-2 mb-2">
        {icon}
        {label}
      </label>

      <input
        {...props}
        className="w-full card-theme rounded-xl p-3"
      />

    </div>
  );
}

export default PersonalInfo;