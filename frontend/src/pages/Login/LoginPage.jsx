import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { login } from "../../services/authentication";

import { PreLoginButton } from "../../components/PreLogin/PreLoginButton";
import { InputField } from "../../components/PreLogin/InputField";

import { FaEnvelope, FaLock } from "react-icons/fa";

import "./LoginPage.css";
import logo from "../../assets/logo.png";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const signupSuccess = location.state?.message;

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const data = await login(email, password);

      const token = data.token;
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      const userId = decoded.sub;

      localStorage.setItem("user_id", userId);

      navigate("/");
    } catch (err) {
      console.error("Could not login user");
      console.error(err);

      setError("Invalid email or password");
    }
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  return (
    <div className="login-page">
      <main className="login-card">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Crustpilot logo" />
          </Link>
        </div>

        {signupSuccess && (
          <div className="success-message" aria-live="polite">
            {signupSuccess}
          </div>
        )}
        <h2>Enter your info to sign in</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message" role="alert" aria-live="assertive">
              {error}
            </div>
          )}

          <InputField
            type="email"
            aria-label="Email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            icon={FaEnvelope}
          />

          <InputField
            type="password"
            aria-label="Password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            icon={FaLock}
          />

          <PreLoginButton type="submit">Log In</PreLoginButton>

          <div className="sign-up">
            <p>
              New here?{" "}
              <Link to="/signup">
                <strong>Sign up</strong>
              </Link>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
