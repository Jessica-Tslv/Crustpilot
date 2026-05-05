import React from "react";
import { Link } from "react-router-dom";
import "./PreLoginButton.css";

export function PreLoginButton({ children, onClick, to }) {
  if (to) {
    return (
      <Link to={to} className="prelogin-btn">
        {children}
      </Link>
    );
  }

  return (
    <button className="prelogin-btn" onClick={onClick}>
      {children}
    </button>
  );
}
