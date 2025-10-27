/**
 * createEditForm(user)
 * returns { formEl, getValues } where getValues() returns current values.
 */
export function createEditForm(user) {
  const form = document.createElement('form');
  form.className = 'p-3';

  form.innerHTML = `
    <div class="mb-3">
      <label class="form-label">Name</label>
      <input name="name" type="text" class="form-control" value="${escapeHtml(user.name||'')}" required>
    </div>
    <div class="mb-3">
      <label class="form-label">Age</label>
      <input name="age" type="number" min="0" class="form-control" value="${user.age ?? ''}" required>
    </div>
    <div class="mb-3">
      <label class="form-label">Avatar URL</label>
      <input name="avatar_url" type="url" class="form-control" value="${escapeHtml(user.avatar_url||'')}">
      <div class="form-text">Optional: link to an image</div>
    </div>
    <div class="mb-3">
      <label class="form-label">Gender</label>
      <select name="gender" class="form-select" required>
        <option value="">Select...</option>
        <option value="male">male</option>
        <option value="female">female</option>
        <option value="other">other</option>
      </select>
    </div>
  `;

  // set select value
  const select = form.querySelector('select[name="gender"]');
  if (user.gender) select.value = user.gender;

  function getValues() {
    const data = new FormData(form);
    return {
      name: (data.get('name') || '').trim(),
      age: Number(data.get('age')) || 0,
      avatar_url: (data.get('avatar_url') || '').trim(),
      gender: (data.get('gender') || '').trim()
    };
  }

  return { formEl: form, getValues };

  // helper to escape HTML for attribute insertion
  function escapeHtml(str) {
    return String(str).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  }
}

