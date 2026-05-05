
import "../../pages/Profile/profilePage.css";
import { useState } from "react";
import { updateUserPassword } from "../../services/user";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./ChangePassword.css";

import "../../pages/Profile/profilePage.css";

export function ChangePassword({ user, onClose, onPasswordSuccess }) {
  const [error, setError] = useState("");
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: "a",
    newPassword: "b",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  //Function that updates form data based on what is being typed
  
  
  const handlePasswordChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setError(false)
    setPasswordFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    console.log("PssRD", passwordFormData);
  };
  const handlePasswordCancel = () => {
    onClose();
  };
 

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Reset error state

    const uploadData = {
      new_password: passwordFormData.newPassword,
      current_password: passwordFormData.currentPassword,
    };

    try {
      await updateUserPassword(user._id, uploadData);
      // If we get here, it was successful
      if (onPasswordSuccess) onPasswordSuccess("Password updated successfully!");
      onClose();
    } catch (err) {
      // This catches the 'throw new Error(data.message)' from your service file
      setError(err.message);
    }
  };

  //Step 1. bcrpt the passwordFormData.currentPassword

  return (
    <div>
      <form className="profile-password__form" onSubmit={handlePasswordSubmit}>
        <div className="profile-password__field">
          <label htmlFor="currentPasswordTitle">Current Password</label>
          <input
            className="profile-password__input"
            type={showCurrentPassword ? "text" : "password"}
            id="currentPassword"
            name="currentPassword"
            aria-label="currentPassword"
            onChange={handlePasswordChange}
          />
          <button 
            className="toggleCurrentPassword"
            type="button"
            onClick={() => setShowCurrentPassword((prev) => !prev)}
          >{showCurrentPassword ? <FaEye /> : <FaEyeSlash /> }
          </button>
          {error && <p className="error-message">{error}</p>}
        </div>
      

        <div className="profile-password__field">
          <label htmlFor="newPasswordTitle">New Password</label>
          <input
            className="profile-password__textarea"
            type={showNewPassword ? "text" : "password"}
            id="newPassword"
            name="newPassword"
            aria-label="newPassword"
            onChange={handlePasswordChange}
          />
          <button 
            className="toggleNewPassword"
            type="button"
            onClick={() => setShowNewPassword((prev) => !prev)}
          >{showNewPassword ? <FaEye /> : <FaEyeSlash /> }
          </button>
        </div>

        <div className="profile-password__button-row">
          <button className="save-button" role="save-button" type="submit">
            Save
          </button>
          <button className="cancel-button"type="button" onClick={handlePasswordCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
