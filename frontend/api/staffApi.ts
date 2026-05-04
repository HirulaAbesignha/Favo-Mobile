import api from './axiosConfig';

export interface StaffData {
  staffName: string;
  email: string;
  phone: string;
  position: string;
  assignedDepartment: string;
  availabilityStatus?: string;
  profileImage?: string;
}

export const staffApi = {
  createStaff: (data: StaffData) => api.post('/staff', data),
  getAllStaff: () => api.get('/staff'),
  getStaffById: (id: string) => api.get(`/staff/${id}`),
  updateStaff: (id: string, data: Partial<StaffData>) => api.put(`/staff/${id}`, data),
  deleteStaff: (id: string) => api.delete(`/staff/${id}`),
};
