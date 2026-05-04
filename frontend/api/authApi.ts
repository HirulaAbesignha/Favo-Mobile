import api from './axiosConfig';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authApi = {
  register: (data: RegisterData) => api.post('/auth/register', data),
  login: (data: LoginData) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};
