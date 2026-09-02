// Helper to add authorization header if token exists
export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  return res;
};

// Fetch with proper error handling
export async function apiFetch(endpoint, options = {}) {
  try {
    const res = await apiCall(endpoint, options);

    if (!res.ok) {
      let errorText = '';
      try {
        errorText = await res.text();
      } catch (e) {
        errorText = `HTTP ${res.status}`;
      }

      const err = new Error(errorText || `HTTP ${res.status}`);
      err.status = res.status;
      err.response = { data: { message: errorText || `HTTP Error ${res.status}` } };
      throw err;
    }

    const data = await res.json();
    return data;
  } catch (ex) {
    console.error('API Error:', ex);

    // Network/connection errors
    if (ex instanceof TypeError && ex.message.includes('fetch')) {
      const connError = new Error('Cannot connect to server. Make sure the backend is running on port 5262.');
      connError.response = { data: { message: 'Cannot connect to server. Make sure the backend is running.' } };
      throw connError;
    }

    throw ex;
  }
}
