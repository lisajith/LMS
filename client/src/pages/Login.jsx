import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Container from "../components/common/Container";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

import { signInWithEmailAndPassword, signOut } from "firebase/auth";

import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      alert("Please fill all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      alert("Please enter a valid email.");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    try {
      // Login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        trimmedEmail,
        password
      );

      await userCredential.user.reload();

      // Email verification
      if (!userCredential.user.emailVerified) {
        await signOut(auth);

        alert("Please verify your email before logging in.");

        return;
      }

      // Fetch role from Firestore
      const userRef = doc(db, "users", userCredential.user.uid);
      const userSnap = await getDoc(userRef);

      const role = userSnap.exists() ? userSnap.data().role : "student";

      // Redirect
      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        alert("Invalid email or password.");
      } else {
        alert(error.message);
      }
    }
  }

  return (
    <section className="py-24">
      <Container>
        <div className="max-w-lg mx-auto card-theme rounded-3xl shadow-lg p-10">
          <h1 className="text-4xl font-bold mb-8 text-center">Welcome Back</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit">Let's GO</Button>
          </form>
        </div>
      </Container>
    </section>
  );
}

export default Login;
