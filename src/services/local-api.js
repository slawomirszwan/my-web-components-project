const API_BASE = 'http://localhost:3002/api'

export class LocalApiService {
  static async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API Request failed:', error)
      throw error
    }
  }

  // Users
  static async getUsers() {
    return this.request('/users')
  }

  static async getUser(id) {
    return this.request(`/users/${id}`)
  }

  static async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  // Posts
  static async getPosts() {
    return this.request('/posts')
  }

  static async createPost(postData) {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    })
  }

  // Health check
  static async healthCheck() {
    return this.request('/health')
  }
}