import { useState } from "react";

import Container from "../components/common/Container";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signOut,
} from "firebase/auth";

import { auth, db } from "../firebase/firebase";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSubmit(e) {

    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    // Empty Fields
    if (
      !trimmedName ||
      !trimmedEmail ||
      !trimmedPhone ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill all fields.");
      return;
    }

    // Name Validation
    if (trimmedName.length < 3) {
      alert("Name must contain at least 3 characters.");
      return;
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Phone Validation
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(trimmedPhone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    // Password Length
    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    // Password Strength
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
      alert(
        "Password must contain uppercase, lowercase, number and special character."
      );
      return;
    }

    // Password Match
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {

      // Create User
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          trimmedEmail,
          password
        );

      // Update Firebase Auth Profile
      await updateProfile(userCredential.user, {
        displayName: trimmedName,
      });

      // Send Verification Email
      await sendEmailVerification(userCredential.user);

      // Save User in Firestore
      await setDoc(
        doc(db, "users", userCredential.user.uid),
        {
          uid: userCredential.user.uid,
          name: trimmedName,
          email: trimmedEmail,
          phone: trimmedPhone,

          role: "student",

          emailVerified: false,

          createdAt: serverTimestamp(),

          gender: "",
          dob: "",
          bio: "",
          address: "",

          photoURL: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
            trimmedName
          )}`,
        }
      );

      // Logout immediately
      await signOut(auth);

      alert(
        "🎉 Registration Successful!\n\nA verification email has been sent.\n\nPlease verify your email before logging in."
      );

      navigate("/login", { replace: true });

    } catch (error) {

      switch (error.code) {

        case "auth/email-already-in-use":
          alert("This email is already registered.");
          break;

        case "auth/weak-password":
          alert("Password is too weak.");
          break;

        case "auth/invalid-email":
          alert("Invalid email address.");
          break;

        default:
          alert(error.message);

      }

    }

  }

  return (
    <section className="py-24">

      <Container>

        <div className="max-w-lg mx-auto card-theme rounded-3xl shadow-lg p-10">

          <h1 className="text-4xl font-bold mb-8 text-center">
            Create Account
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <Input
              label="Full Name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
            />

            <Button type="submit">
              Register
            </Button>

          </form>

        </div>

      </Container>

    </section>
  );

}

export default Register;