import api from './axiosConfig';

export interface ComplaintData {
  bookingId?: string;
  subject: string;
  description: string;
  image?: string;
}

export const complaintApi = {
  createComplaint: (data: ComplaintData) => api.post('/complaints', data),
  getMyComplaints: () => api.get('/complaints/my-complaints'),
  getAllComplaints: () => api.get('/complaints'),
  getComplaintById: (id: string) => api.get(`/complaints/${id}`),
  updateStatus: (id: string, status: string, adminResponse?: string) =>
    api.put(`/complaints/${id}/status`, { status, adminResponse }),
  deleteComplaint: (id: string) => api.delete(`/complaints/${id}`),
};
