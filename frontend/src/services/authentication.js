// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function login(email, password) {
  const payload = {
    email: email,
    password: password,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  const response = await fetch(`${BACKEND_URL}/tokens`, requestOptions);

  // docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
  if (response.status === 201) {
    let data = await response.json();
    return data;
  } else {
    throw new Error(
      `Received status ${response.status} when logging in. Expected 201`,
    );
  }
}

export async function signup(firstName, surname, email, password) {
  const payload = {
    firstName: firstName,
    surname: surname,
    email: email,
    password: password,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  let response = await fetch(`${BACKEND_URL}/users`, requestOptions);

  // parse backend response body - shows errors
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || `Signup failed with status ${response.status}`,
    );
  }

  return data;
}

function handleSignupError(data) {
  if (data.message.includes("already exists")) {
    return new Error(
      "An account with this email already exists. Please log in.",
    );
  }
  return new Error(data.mesage || "Something went wrong during signup.");
}
