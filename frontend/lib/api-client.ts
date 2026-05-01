import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://zuwandaku-backend-holy-glitter-298.fly.dev/api",
  headers: { "Content-Type": "application/json" },
});

// Injecter le token JWT automatiquement
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Rediriger vers login si 401
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/admin')) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export const apiClient = {
  login: (data: any) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  getProperties: (filters?: any) => {
    const params = new URLSearchParams(filters as any);
    return api.get(`/properties?${params.toString()}`);
  },
  getProperty: (id: string) => api.get(`/properties/${id}`),
  getMyProperties: () => api.get('/properties/my'),
  createProperty: (data: any) => api.post('/properties', data),
  updateProperty: (id: string, data: any) => api.patch(`/properties/${id}`, data),
  deleteProperty: (id: string) => api.delete(`/properties/${id}`),
  getVehicles: (filters?: any) => {
    const params = new URLSearchParams(filters as any);
    return api.get(`/vehicles?${params.toString()}`);
  },
  getVehicle: (id: string) => api.get(`/vehicles/${id}`),
  getMyVehicles: () => api.get('/vehicles/my'),
  createVehicle: (data: any) => api.post('/vehicles', data),
  updateVehicle: (id: string, data: any) => api.patch(`/vehicles/${id}`, data),
  deleteVehicle: (id: string) => api.delete(`/vehicles/${id}`),
  getProvinces: () => api.get('/provinces'),
  getProvince: (id: string) => api.get(`/provinces/${id}`),
  getContracts: (filters?: any) => {
    const params = new URLSearchParams(filters as any);
    return api.get(`/contracts?${params.toString()}`);
  },
  getGlobalStats: () => api.get('/stats/global'),
  getOwnerStats: () => api.get('/stats/owner'),
  getClientStats: () => api.get('/stats/client'),
  updateContract: (id: string, data: any) => api.patch(`/contracts/${id}`, data),
  createContract: (data: any) => api.post('/contracts', data),
  // Hotel Rooms
  getRooms: (filters?: any) => {
    const params = new URLSearchParams(filters as any);
    return api.get(`/rooms?${params.toString()}`);
  },
  getRoom: (id: string) => api.get(`/rooms/${id}`),
  createRoom: (data: any) => api.post('/rooms', data),
  updateRoom: (id: string, data: any) => api.patch(`/rooms/${id}`, data),
  deleteRoom: (id: string) => api.delete(`/rooms/${id}`),
  // Member Assignation
  getAssignationDossiers: (params?: { search?: string; status?: string; type?: string }) => api.get('/member-assignation/dossiers', { params }),
  getAssignationUsers: (search: string, role?: string, exclude?: string) => api.get('/member-assignation/users', { params: { search, role, exclude } }),
  getDossierMembers: (dossierId: string) => api.get(`/member-assignation/dossier/${dossierId}/members`),
  assignDossierMember: (dossierId: string, data: { userId: string; type: 'responsable' | 'member' }) => api.post(`/member-assignation/assign/dossier/${dossierId}`, data),
  setDossierResponsable: (dossierId: string, userId: string | null) => api.post(`/member-assignation/responsable/dossier/${dossierId}`, { userId }),
  removeDossierMember: (dossierId: string, userId: string) => api.delete(`/member-assignation/member/dossier/${dossierId}/${userId}`),
  // Permissions
  getRolePermissions: (role: string) => api.get(`/users/role-permissions/${role}`),
  toggleRolePermission: (data: { role: string; module: string }) => api.post('/users/toggle-role-permission', data),
  getUsersByRole: (role: string) => api.get(`/users?role=${role}`),
  // Dept Admin
  getDeptAdmins: () => api.get('/admin/dept-admins'),
  createDeptAdmin: (data: { name: string; email: string; password: string; department: string }) => api.post('/admin/dept-admins', data),
  getDeptStats: (department: string) => api.get(`/admin/dept-stats/${department}`),
  // Password reset
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  verifyOtp: (email: string, code: string) => api.post('/auth/verify-otp', { email, code }),
  resetPassword: (email: string, code: string, newPassword: string) => api.post('/auth/reset-password', { email, code, newPassword }),
  // Restaurant
  getRestaurantMenu: (category?: string) => api.get('/restaurant/menu', { params: category ? { category } : {} }),
  createRestaurantMenuItem: (data: any) => api.post('/restaurant/menu', data),
  updateRestaurantMenuItem: (id: string, data: any) => api.patch(`/restaurant/menu/${id}`, data),
  deleteRestaurantMenuItem: (id: string) => api.delete(`/restaurant/menu/${id}`),
  getRestaurantOrders: (status?: string) => api.get('/restaurant/orders', { params: status ? { status } : {} }),
  getRestaurantOrderStats: () => api.get('/restaurant/orders/stats'),
  createRestaurantOrder: (data: any) => api.post('/restaurant/orders', data),
  updateRestaurantOrderStatus: (id: string, status: string, treatedBy?: string) => api.patch(`/restaurant/orders/${id}/status`, { status, treatedBy }),
  updateRestaurantPayment: (id: string, paymentStatus: string) => api.patch(`/restaurant/orders/${id}/payment`, { paymentStatus }),
  // API Keys
  getApiKeys: () => api.get('/admin/apikey'),
  createApiKey: (role: string) => api.post('/admin/apikey', { role }),
  deleteApiKey: (id: string) => api.delete(`/admin/apikey/${id}`),
};


