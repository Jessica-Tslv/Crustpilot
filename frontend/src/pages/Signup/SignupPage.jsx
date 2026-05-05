import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { signup } from "../../services/authentication";

import { PreLoginButton } from "../../components/PreLogin/PreLoginButton";
import { InputField } from "../../components/PreLogin/InputField";

import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

import "./SignupPage.css";
import logo from "../../assets/logo.png";

export function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await signup(firstName, surname, email, password);
      navigate("/login", {
        state: { message: "Account created successfully." },
      });
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  function handleFirstNameChange(event) {
    setFirstName(event.target.value);
  }

  function handleSurnameChange(event) {
    setSurname(event.target.value);
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleConfirmPasswordChange(event) {
    setConfirmPassword(event.target.value);
  }

  return (
    <div className="signup-page">
      <main className="signup-card">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Picture of the website logo" />
          </Link>
        </div>
        <h2>Get started with a new account</h2>
        {error && (
          <p
            id="signup-error"
            className="error-message"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </p>
        )}

        <form className="signup-form" onSubmit={handleSubmit}>
          <InputField
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={handleFirstNameChange}
            icon={FaUser}
            required
            aria-describedby={error ? "signup-error" : undefined}
          />

          <InputField
            type="text"
            placeholder="Surname"
            value={surname}
            onChange={handleSurnameChange}
            icon={FaUser}
            required
            aria-describedby={error ? "signup-error" : undefined}
          />

          <InputField
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            icon={FaEnvelope}
            required
            aria-describedby={error ? "signup-error" : undefined}
          />

          <InputField
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            icon={FaLock}
            required
          />

          <InputField
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            icon={FaLock}
            required
            aria-describedby={error ? "signup-error" : undefined}
          />

          <PreLoginButton type="submit">Sign Up</PreLoginButton>
          <div className="already-registered">
            <p>
              Already registered?{" "}
              <Link to="/login">
                <strong>Log in</strong>
              </Link>{" "}
              and continue your journey.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
