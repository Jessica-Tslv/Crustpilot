const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function search(searchQuery) {
  try {
    const requestOptions = {
      method: "GET",
    };

    const response = await fetch(
      `${BACKEND_URL}/search?searchQuery=${searchQuery}`,
      requestOptions,
    );

    if (response.status !== 200) {
      throw new Error("Unable to get search result");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Could not make request for search places");
    console.error(error);
    return { message: "Service is down please try again later", ok: false };
  }
}
