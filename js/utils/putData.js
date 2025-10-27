const BASE_URL = 'https://easy-simple-users-rest-api.onrender.com/api/users';
const HEADERS = {
  'Content-Type': 'application/json',
  'my_key': 'my_super_secret_phrase'
};

/**
 * updateUser: sends PUT request to update a user
 * @param {number|string} id
 * @param {object} payload - fields to update (e.g. {name, age, gender, avatar_url})
 */
export async function updateUser(id, payload) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: HEADERS,
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const body = await res.text().catch(()=>null);
      throw new Error(`Update failed: ${res.status} ${res.statusText} ${body||''}`);
    }
    const updated = await res.json();
    return updated;
  } catch (err) {
    throw new Error(`Network error while updating user: ${err.message}`);
  }
}

