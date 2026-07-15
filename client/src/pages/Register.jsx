import { useState } from "react";

import Container from "../components/common/Container";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { sendEmailVerification } from "firebase/auth";
import { db } from "../firebase/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    // Remove extra spaces
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    console.log({
      name: trimmedName,
      email: trimmedEmail,
      password,
      confirmPassword,
    });

    // 1. Empty fields
    if (!trimmedName || !trimmedEmail || !password || !confirmPassword) {
      alert("Please fill all fields.");
      return;
    }

    // 2. Name validation
    if (trimmedName.length < 3) {
      alert("Name must contain at least 3 characters.");
      return;
    }

    // 3. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    // 4. Password length
    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    // 5. Password strength
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
      alert(
        "Password must contain an uppercase letter, lowercase letter, number, and special character."
      );
      return;
    }

    // 6. Password match
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        trimmedEmail,
        password
      );
      await updateProfile(userCredential.user, {
        displayName: trimmedName,
      });
      console.log(userCredential.user);
      await sendEmailVerification(userCredential.user);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        name: trimmedName,
        email: trimmedEmail,
        phone: phone.trim(),
        role: "student",
        emailVerified: false,
        createdAt: serverTimestamp(),
        
        photoURL: "",
        gender: "",
        dob: "",
        bio: "",
        address: "",

        photoURL: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
          trimmedName
        )}`,
      });
      alert("Registration successful! Please check your email and verify your account before logging in.");
    } catch (error) {
      if(error.code === "auth/email-already-in-use"){
        alert("email already in use!");
      }else{
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
              placeholder="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              label="Confirm Password"
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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