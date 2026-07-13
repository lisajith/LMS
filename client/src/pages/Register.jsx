import { useState } from "react";

import Container from "../components/common/Container";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleSubmit(e) {
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

    alert("Registration Successful! 🎉");
}

  return (
    <section className="py-24">

      <Container>

        <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-lg p-10">

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