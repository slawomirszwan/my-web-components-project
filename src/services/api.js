// Base URL - możesz umieścić go w zmiennej środowiskowej
const BASE_URL = 'https://jsonplaceholder.typicode.com';

// Funkcja do wykonywania zapytań HTTP
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Konkretne metody API
export async function getPosts() {
  return request('/posts');
}

export async function getPost(id) {
  return request(`/posts/${id}`);
}

export async function createPost(postData) {
  return request('/posts', {
    method: 'POST',
    body: JSON.stringify(postData),
  });
}

// ... inne funkcje dla różnych endpointów
