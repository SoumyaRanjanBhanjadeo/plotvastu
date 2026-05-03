import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data - the SessionExpiredModal will be shown by useAuth hook
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('tokenExpiresAt');
      
      // Dispatch custom event to trigger session expired modal
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('sessionExpired'));
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  // register endpoint removed — user creation is admin-only via /auth/create-user
  createUser: (userData) => api.post('/auth/create-user', userData),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Property API
export const propertyAPI = {
  getAll: (params) => api.get('/properties', { params }),
  getFeatured: (limit) => api.get('/properties/featured', { params: { limit } }),
  getById: (id) => api.get(`/properties/${id}`),
  getStats: () => api.get('/properties/stats'),
  // Admin
  getAllAdmin: (params) => api.get('/properties/admin/all', { params }),
  create: (data) => api.post('/properties', data),
  update: (id, data) => api.put(`/properties/${id}`, data),
  delete: (id) => api.delete(`/properties/${id}`),
  toggleFeatured: (id) => api.patch(`/properties/${id}/featured`),
};

// Inquiry API
export const inquiryAPI = {
  create: (data) => api.post('/inquiries', data),
  // Admin
  getAll: (params) => api.get('/inquiries', { params }),
  getStats: () => api.get('/inquiries/stats'),
  getRecent: (limit) => api.get('/inquiries/recent', { params: { limit } }),
  getById: (id) => api.get(`/inquiries/${id}`),
  update: (id, data) => api.put(`/inquiries/${id}`, data),
  delete: (id) => api.delete(`/inquiries/${id}`),
};

// Media API
export const mediaAPI = {
  upload: (base64Image) =>
    api.post('/media/upload', { image: base64Image }),
  uploadMultiple: (data) =>
    api.post('/media/upload-multiple', data),
  delete: (publicId) => api.delete(`/media/${publicId}`),
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getProperties: () => api.get('/analytics/properties'),
  getLeads: () => api.get('/analytics/leads'),
};

// Contact API
export const contactAPI = {
  send: (data) => api.post('/contact', data),
};

// Website Content API
export const websiteContentAPI = {
  getHero: () => api.get('/website-content/hero'),
  getTestimonials: () => api.get('/website-content/testimonials'),
  getFooter: () => api.get('/website-content/footer'),
  getSettings: () => api.get('/website-content/settings'),
  // Admin
  getAll: () => api.get('/website-content/admin/all'),
  updateHero: (data) => api.put('/website-content/admin/hero', data),
  updateTestimonials: (data) => api.put('/website-content/admin/testimonials', data),
  updateFooter: (data) => api.put('/website-content/admin/footer', data),
  updateSettings: (data) => api.put('/website-content/admin/settings', data),
};

export default api;
