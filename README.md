# User Management Application
A responsive web app that fetches users from an API, displays them in Bootstrap cards, and allows live editing using a modal , no page reloads.

# Hi, I'm Fathima Gafoor,
# The API seems to be down or returning “Unauthorized,” so for testing, I’ve used mock data. With the mock data: users display correctly, edits update live, and everything else works as expected. Once the API is back and the key works, the app will fetch and update real user data automatically

# js/utils/fetchData.js

export async function fetchUsers() {
  
  await new Promise(resolve => setTimeout(resolve, 500));

  
  return [
    { id: 1, name: "Alice", age: 25, gender: "female", avatar_url: "" },
    { id: 2, name: "Bob", age: 30, gender: "male", avatar_url: "" },
    { id: 3, name: "Charlie", age: 28, gender: "other", avatar_url: "" }
  ];
}

# js/utils/putData.js

export async function updateUser(id, payload) {
  
  await new Promise(resolve => setTimeout(resolve, 500));

  console.log("Mock update user:", id, payload);

  
  return { id, ...payload };
}
