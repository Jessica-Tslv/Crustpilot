// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getPosts(token) {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(`${BACKEND_URL}/posts`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to fetch posts");
  }

  const data = await response.json();
  return data;
}

export async function getPostById(id) {
  try {
    const requestOptions = {
      method: "GET",
    };

    const response = await fetch(`${BACKEND_URL}/posts/${id}`, requestOptions);

    if (response.status !== 200) {
      throw new Error("Unable to fetch post by id");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Could not make request for get posts by id");
    console.error(error);
    return { message: "Service is down please try again later", ok: false };
  }
}

// Assuming your Vite app proxies API requests to your backend
export const addPlace = async (placeData, token) => {
  const response = await fetch(`${BACKEND_URL}/posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // Send the JWT token for authentication
    },
    body: placeData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Could not add place");
  }

  return response.json();
};
