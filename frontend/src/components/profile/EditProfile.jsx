
import "../../pages/Profile/profilePage.css";
import { useState } from "react";
import { updateUserProfile } from "../../services/user";
import "../../pages/Profile/profilePage.css";
import { ChangePassword } from "./ChangePassword";

export function EditProfile({ user, onProfileUpdated }) {
  const [target, setTarget] = useState("non-hidden");



  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    firstName: user?.profile?.firstName || "",
    lastName: user?.profile?.lastName || "",
    email: user?.email || "",
    bio: user?.profile?.bio || "",
  });
  const [InitialData, setInitialData] = useState([]);

  const handlePasswordSuccess = (msg) => {
    setSuccessMessage(msg);
    // Optional: clear the message after 5 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 5000);
  };

  //button to edit user
  const handleEdit = () => {
    setInitialData(formData);
    console.log("IN!!", InitialData);

    console.log("first target", target);
    setTarget("hidden");
    console.log("second target.....", target);


    setError("");
    setIsEditing(true);
  };

  //Button to change Password 
  const handleChangePassClick = () => {
    console.log("IN!!", InitialData);

    console.log("first target", target);
    setTarget("hidden");
    console.log("second target.....", target);


    setError("");
    setIsPasswordEditing(true);
  };


  /////

  //Function that updates form data based on what is being typed
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
    console.log("bbbb", formData);
  };

  const handleCancel = () => {
    setFormData(InitialData);
    setImage(null);
    //FIX AFTER
    setTarget("non-hidden");
    setIsEditing(false);
    setError("");
  };

  //Function to save changes to user
  const handleSubmit = async (event) => {
    setTarget("non-hidden");
    console.log("HANDLING SUBMIT");
    event.preventDefault();
    setError("");

    const uploadData = new FormData();

    uploadData.append("email", formData.email);
    uploadData.append("firstName", formData.firstName);
    uploadData.append("lastName", formData.lastName);
    uploadData.append("bio", formData.bio);

    if (image) {
      uploadData.append("profilePic", image);
    }

    try {
      console.log("USERID HERE", user._id);
      const data = await updateUserProfile(user._id, uploadData);
      
      onProfileUpdated(data.user);

      setFormData({
        firstName: data.user?.profile?.firstName || "",
        lastName: data.user?.profile?.lastName || "",
        email: data.user?.email || "",
        bio: data.user?.profile?.bio || "",
      });

      setImage(null);
      setIsEditing(false);
    } catch (error) {
      setError(error.message || "Failed to update profile");
    }
  };

  return (
    <div>
      <div className="profile-page-whole">
        {/* NEW: Display the success message if it exists */}
        {successMessage && (
          <div className="profile-success-alert" style={{ color: "#dcb900", marginBottom: "10px" }}>
            {successMessage}
          </div>
        )}

        <div className="profpic" role="profpic">
          {user?.profile?.profilePic && user.profile.profilePic !== "defaultProfilePic" ? (
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}${user.profile.profilePic}`}
              alt="profile"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "12px",
              }}
            />
          ) : (
            "No profile picture"
          )}
        </div>

        <div className="profile-page-info" id={target}>
          {console.log("PROFILE DATA HEREBLAH: ", formData)}

          <p role="firstName" id={target}>
            <i>First name:</i> {formData.firstName}
          </p>

          <p role="lastName">
            <i>Last name:</i> {formData.lastName}
          </p>

          <p role="email">
            <i>Email:</i> {formData.email}
          </p>

          <p role="bio">
            <i>Bio:</i> {formData.bio}
          </p>
        </div>

        {isEditing ? (
          <form className="profile-edit__form" onSubmit={handleSubmit} aria-label="Edit profile form">
            <div className="profile-edit__field">
              <label htmlFor="firstName">First name</label>
              <input
                className="profile-edit__input"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            <div className="profile-edit__field">
              <label htmlFor="lastName">Last Name</label>
              <input
                className="profile-edit__input"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <div className="profile-edit__field">
              <label htmlFor="email">Email</label>
              <input
                className="profile-edit__input"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="profile-edit__field">
              <label htmlFor="bio">Biography</label>
              <textarea
                className="profile-edit__textarea"
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
              />
            </div>

            <div className="profile-edit__field">
              <label htmlFor="profilePic">Profile Picture</label>
              <input
                id="profilePic"
                name="profilePic"
                type="file"
                accept="image/*"
                onChange={(event) => setImage(event.target.files[0])}
              />
            </div>

            <div className="profile-edit__button-row">
              <button role="save-button" type="submit">
                Save
              </button>
              <button type="button" onClick={handleCancel}>
                Cancel
              </button>
            </div>

            {error && <p className="profile-edit__error">{error}</p>}
          </form>
        ) : isPasswordEditing ? (
          <ChangePassword 
            user={user} 
            onClose={() => {
              setIsPasswordEditing(false);
              setTarget("non-hidden");
            }}
            onPasswordSuccess={handlePasswordSuccess}
          />
        ) : (
          <div className="update-buttons-container">
            <button
              className="update-user-btn"
              id="editProfile"
              onClick={handleEdit}
            >
              Edit <br></br>Profile
            </button>
            <button
              className="update-user-btn"
              id="changePassword"
              onClick={handleChangePassClick}
            >
              Change<br></br>Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}