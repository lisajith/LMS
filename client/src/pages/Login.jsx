import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Container from "../components/common/Container";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    // Remove extra spaces
    const trimmedEmail = email.trim();

    console.log({
      email: trimmedEmail,
      password,
    });

    // Empty fields
    if (!trimmedEmail || !password ) {
      alert("Please fill all fields.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Password length
    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        trimmedEmail,
        password
      );
      if (!userCredential.user.emailVerified) {
        alert("Please verify your email before logging in.");
        await signOut(auth);
        return;
      }
      console.log(userCredential.user);
      navigate("/dashboard");
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

          <h1 className="text-4xl font-bold mb-8 text-center">
            Welcome Back
          </h1>

          <form
              onSubmit={handleSubmit}
              className="space-y-6"
          >

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

            <Button type="submit">

              Let's GO

            </Button>

          </form>

        </div>

      </Container>

    </section>
  );
}

export default Login;