const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getMyProfile() {
  console.log("GET MY PROFILE IS RUNNING");
  const token = localStorage.getItem("token");
  console.log("Token!------>>>", token);

  const response = await fetch(`${BACKEND_URL}/profile/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("response has done something");

  const data = await response.json();
  console.log("RESPONSE IS::", data);

  if (!response.ok) {
    throw new Error(data.message || "Unable to fetch profile");
  }

  return data.user;
}

export async function updateUserProfile(userId, uploadData) {
  console.log("HERE IT IS", uploadData)
  const token = localStorage.getItem("token");

  const response = await fetch(`${BACKEND_URL}/users/${userId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: uploadData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to update profile");
  }

  return data;
}

export async function updateUserPassword(userId, uploadData) {
   const token = localStorage.getItem("token");

  const response = await fetch(`${BACKEND_URL}/users/pass/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(uploadData),
  });
  

  const data = await response.json();
  console.log(data)



  if (!response.ok) {
    throw new Error(data.message || "Unable to update profile");
  }

  return data;


}



