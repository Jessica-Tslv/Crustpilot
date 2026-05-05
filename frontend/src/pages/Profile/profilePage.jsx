import { useEffect, useState } from "react";
import { getMyProfile } from "../../services/user";
import ProfilePagePlaces from "../../components/profile/profilePagePlaces";
import "./profilePage.css";
import { EditProfile } from "../../components/profile/EditProfile";

export function ProfilePage() {
  console.log("profile page function is running!!");
  const [profileData, setProfileData] = useState(null);


  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getMyProfile();
        setProfileData(data);
      } catch (error) {
        //do nothing
      }
    }
    loadProfile();
  }, []);


 

  const handleProfileUpdated = (updatedUser) => {
    setProfileData(updatedUser);
  };

  if (!profileData) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <EditProfile
        profileData={profileData}
        user={profileData}
        onProfileUpdated={handleProfileUpdated}
        className="update-user-btn"
      />

      <div className="section-divider"></div>

      <div className="profile-page-places">
        <ProfilePagePlaces />
      </div>
    </>
  );
}