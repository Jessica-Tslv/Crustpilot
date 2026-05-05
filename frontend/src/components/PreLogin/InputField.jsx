import { useState, useEffect, useRef } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import "./InputField.css";

export function InputField({ type, placeholder, value, onChange, icon: Icon }) {
  const [showPassword, setShowPassword] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const inputRef = useRef(null);
  const isPassword = type === "password";

  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  return (
    <div
      className={`input-wrapper ${hasValue ? "has-value" : ""}`}
      // data-placeholder={placeholder}
    >
      {Icon && <Icon className="input-icon" />}
      <input
        ref={inputRef}
        className="input-field"
        type={isPassword && showPassword ? "text" : type}
        aria-label={placeholder}
        value={value}
        onChange={(e) => {
          setHasValue(e.target.value.length > 0);
          onChange(e);
        }}
        required
      />
      <label className="floating-label">{placeholder}</label>

      {isPassword && (
        <span
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      )}
    </div>
  );
}
