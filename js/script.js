import { fetchUsers } from './utils/fetchData.js';
import { updateUser } from './utils/putData.js';
import { createEditForm } from './utils/formFactory.js';

const usersGrid = document.getElementById('users-grid');
const alerts = document.getElementById('alerts');
const initialLoading = document.getElementById('initial-loading');
const editModalEl = document.getElementById('editModal');
const editModalContent = document.getElementById('editModalContent');
let bsModal = null; // will hold Bootstrap modal instance
let usersCache = []; // local cache of users

function showAlert(message, type = 'danger', timeout = 5000) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${escapeHtml(message)}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
  alerts.appendChild(wrapper);
  if (timeout) setTimeout(()=> {
    const alertNode = wrapper.querySelector('.alert');
    if (alertNode) alertNode.classList.remove('show');
    wrapper.remove();
  }, timeout);
}
function escapeHtml(s){ return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }

function createUserCard(user) {
  // card column
  const col = document.createElement('div');
  col.className = 'col-12 col-md-6 col-lg-4';

  const card = document.createElement('div');
  card.className = 'card shadow-sm';

  const img = document.createElement('img');
  img.className = 'card-img-top card-avatar';
  img.alt = `${user.name} avatar`;
  img.src = user.avatar_url || `https://via.placeholder.com/600x400?text=${encodeURIComponent(user.name||'User')}`;

  const body = document.createElement('div');
  body.className = 'card-body';

  body.innerHTML = `
    <h5 class="card-title">${escapeHtml(user.name || '')}</h5>
    <ul class="list-group list-group-flush mb-3">
      <li class="list-group-item"><span class="label">Name:</span> ${escapeHtml(user.name||'')}</li>
      <li class="list-group-item"><span class="label">Age:</span> ${escapeHtml(user.age ?? '')}</li>
      <li class="list-group-item"><span class="label">Gender:</span> ${escapeHtml(user.gender||'')}</li>
    </ul>
    <div class="d-grid">
      <button class="btn btn-secondary btn-edit" type="button">Edit</button>
    </div>
  `;

  card.appendChild(img);
  card.appendChild(body);
  col.appendChild(card);

  // store user id on the element to quickly find it later
  col.dataset.userId = user.id;

  // attach edit listener
  const btn = body.querySelector('.btn-edit');
  btn.addEventListener('click', ()=> openEditModal(user));

  return col;
}

function renderUsers(users) {
  usersGrid.innerHTML = '';
  if (!Array.isArray(users) || users.length === 0) {
    usersGrid.innerHTML = `<div class="col-12"><div class="alert alert-info">No users to show.</div></div>`;
    return;
  }
  const fragment = document.createDocumentFragment();
  users.forEach(u => {
    fragment.appendChild(createUserCard(u));
  });
  usersGrid.appendChild(fragment);
}

async function loadData() {
  initialLoading.style.display = 'block';
  try {
    const users = await fetchUsers();
    usersCache = Array.isArray(users) ? users : [];
    renderUsers(usersCache);
  } catch (err){
    showAlert(err.message || 'Unknown error while loading users', 'danger', 8000);
    usersGrid.innerHTML = `<div class="col-12"><div class="alert alert-warning">Unable to load users.</div></div>`;
  } finally {
    initialLoading.style.display = 'none';
  }
}



function openEditModal(user) {
  // build modal content
  editModalContent.innerHTML = `
    <div class="modal-header">
      <h5 class="modal-title">Edit user: ${escapeHtml(user.name || '')}</h5>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body" id="editModalBody"></div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
      <button id="saveChangesBtn" type="button" class="btn btn-primary">Save changes</button>
    </div>
  `;

  const modalBody = editModalContent.querySelector('#editModalBody');

  // create the form for editing
  const { formEl, getValues } = createEditForm(user);
  modalBody.appendChild(formEl);

  // init bootstrap modal if not already
  if (!bsModal) bsModal = new bootstrap.Modal(editModalEl, { backdrop: 'static', keyboard: false });
  bsModal.show();

  const saveBtn = editModalContent.querySelector('#saveChangesBtn');
  // attach click handler to save changes
  saveBtn.onclick = async () => {
    // basic client-side validation
    const payload = getValues();
    if (!payload.name || !payload.gender || !Number.isFinite(payload.age)) {
      showAlert('Please fill all required fields correctly.', 'warning');
      return;
    }

    // show small spinner in the save button
    const origText = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...`;

    try {
      const updated = await updateUser(user.id, payload);
      // update local cache
      const idx = usersCache.findIndex(u => String(u.id) === String(user.id));
      if (idx >= 0) usersCache[idx] = updated;

      // update card in DOM (live update)
      updateUserCardInDOM(updated);
      showAlert('User updated successfully!', 'success', 3000);
      bsModal.hide();
    } catch (err) {
      showAlert(err.message || 'Failed to update user', 'danger', 7000);
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerHTML = origText;
    }
  };
}

function updateUserCardInDOM(user) {
  const cardCol = usersGrid.querySelector(`[data-user-id="${user.id}"]`);
  if (!cardCol) {
    // If not found, re-render everything
    renderUsers(usersCache);
    return;
  }
  // Replace content of that column with new card
  const newCard = createUserCard(user);
  cardCol.replaceWith(newCard);
}



document.addEventListener('DOMContentLoaded', () => {
  loadData();
});

