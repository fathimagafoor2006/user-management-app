// js/utils/fetchData.js
export async function fetchUsers() {
  const url = "https://easy-simple-users-rest-api.onrender.com/api/users";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        my_key: "my_super_secret_phrase",
      },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Failed to fetch users. Status: ${response.status} ${response.statusText} ${text}`);
    }

    const data = await response.json();
    console.log("Fetched users:", data); // Log the fetched data

    if (!Array.isArray(data)) {
      throw new Error('API did not return an array of users');
    }

    return data;
  } catch (error) {
    console.error("Fetch users error:", error);
    return []; // Return empty array instead of crashing
  }
}
