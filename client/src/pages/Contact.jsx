import { useState, useEffect } from "react";

import {
  Mail,
  Clock3,
  MapPin,
  MessageCircle,
  Send,
  Bug,
  Lightbulb,
  BookOpen,
} from "lucide-react";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import { db } from "../firebase/firebase";

import { useAuth } from "../context/AuthContext";
import PageReveal from "../components/common/PageReveal";

function Contact() {
  const { user, userData } = useAuth();
  const [formData, setFormData] = useState({
    name: userData?.name || "",

    email: user?.email || "",

    type: "Suggestion",

    subject: "",

    message: "",
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,

        name: userData?.name || "",

        email: user.email || "",
      }));
    }
  }, [user, userData]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await addDoc(
        collection(db, "feedback"),

        {
          userId: user?.uid || null,

          userName: userData?.name || formData.name,

          userEmail: user?.email || formData.email,

          type: formData.type,

          subject: formData.subject,

          message: formData.message,

          createdAt: serverTimestamp(),

          status: "Pending",
        }
      );

      alert("Feedback submitted successfully!");

      setFormData({
        name: "",

        email: "",

        type: "Suggestion",

        subject: "",

        message: "",
      });
    } catch (error) {
      console.error(error);

      alert("Something went wrong. Please try again.");
    }
  }

  return (
    <PageReveal>
    <div className="bg-theme min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold">Contact & Feedback</h1>

          <p className="text-theme-muted mt-5 max-w-3xl mx-auto text-lg leading-8">
            Have a suggestion, found a bug, or want a new feature? Help us
            improve the learning experience by sharing your thoughts.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel */}

          <div
            className="
              rounded-3xl
              border
              border-theme
              bg-theme
              shadow-xl
              p-8
              space-y-8
            "
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Mail size={22} className="text-blue-500" />

                <h2 className="font-bold text-xl">Email</h2>
              </div>

              <p className="text-theme-muted">thikka@😏😏😏.com</p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <Clock3 size={22} className="text-green-500" />

                <h2 className="font-bold text-xl">Response Time</h2>
              </div>

              <p className="text-theme-muted">Usually within 24 Hours</p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <MapPin size={22} className="text-red-500" />

                <h2 className="font-bold text-xl">Support</h2>
              </div>

              <p className="text-theme-muted">Online Assistance Only</p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <MessageCircle size={22} className="text-purple-500" />

                <h2 className="font-bold text-xl">Need Help?</h2>
              </div>

              <p className="text-theme-muted leading-7">
                Whether you're facing a technical issue, need help accessing a
                course, or have ideas to improve the SyVa, we're always happy to
                hear from you.
              </p>
            </div>

            <div className="border-t border-theme pt-8">
              <h2 className="font-bold text-xl mb-5">Feedback Categories</h2>

              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <Bug size={20} className="text-red-500" />

                  <span>Bug Reports</span>
                </div>

                <div className="flex items-center gap-3">
                  <Lightbulb size={20} className="text-yellow-500" />

                  <span>Feature Requests</span>
                </div>

                <div className="flex items-center gap-3">
                  <BookOpen size={20} className="text-blue-500" />

                  <span>Course Feedback</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}

          <div
            className="
              lg:col-span-2
              rounded-3xl
              border
              border-theme
              bg-theme
              shadow-xl
              p-10
            "
          >
            <h2 className="text-3xl font-bold mb-8">Send Feedback</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="font-semibold">Full Name</label>

                  <input
                    type="text"
                    name="name"
                    required
                    readOnly={!!user}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="
                      w-full
                      mt-2
                      px-4
                      py-3
                      rounded-xl
                      border
                      border-theme
                      bg-theme
                      outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  />
                </div>

                <div>
                  <label className="font-semibold">Email</label>

                  <input
                    type="email"
                    name="email"
                    required
                    readOnly={!!user}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="
                      w-full
                      mt-2
                      px-4
                      py-3
                      rounded-xl
                      border
                      border-theme
                      bg-theme
                      outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="font-semibold">Feedback Type</label>

                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="
                      w-full
                      mt-2
                      px-4
                      py-3
                      rounded-xl
                      border
                      border-theme
                      bg-theme
                      outline-none
                    "
                  >
                    <option>Suggestion</option>

                    <option>Bug Report</option>

                    <option>Feature Request</option>

                    <option>Course Feedback</option>

                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold">Subject</label>

                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Short title"
                    className="
                      w-full
                      mt-2
                      px-4
                      py-3
                      rounded-xl
                      border
                      border-theme
                      bg-theme
                      outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold">Your Feedback</label>

                <textarea
                  rows={8}
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about the issue, suggestion, feature request or improvement..."
                  className="
                    w-full
                    mt-2
                    px-4
                    py-4
                    rounded-xl
                    border
                    border-theme
                    bg-theme
                    outline-none
                    resize-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                />
              </div>

              <button
                type="submit"
                className="
                  btn-primary
                  w-full
                  py-4
                  rounded-xl
                  flex
                  justify-center
                  items-center
                  gap-3
                  text-lg
                "
              >
                <Send size={20} />
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    </PageReveal>
  );
}

export default Contact;
