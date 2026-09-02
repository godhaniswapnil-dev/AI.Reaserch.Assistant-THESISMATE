import { apiFetch } from './apiHelper';

export async function login(emailOrUser, password) {
  const payload = typeof emailOrUser === 'object' && emailOrUser !== null
    ? emailOrUser
    : { email: emailOrUser, password };

  const data = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  if (data?.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
}

export async function register(fullNameOrUser, email, password) {
  const payload = typeof fullNameOrUser === 'object' && fullNameOrUser !== null
    ? fullNameOrUser
    : { fullName: fullNameOrUser, email, password };

  const data = await apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  if (data?.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
}

export async function getDashboard() {
  return await apiFetch('/api/dashboard', {
    method: 'GET'
  });
}

export async function getAllUsers() {
  return await apiFetch('/api/auth/users', {
    method: 'GET'
  });
}

export async function updateUser(id, updateData) {
  const data = await apiFetch(`/api/auth/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });

  if (data?.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
}

