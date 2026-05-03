import api from './axiosConfig';

export interface VisitorData {
  visitorName: string;
  phone: string;
  email?: string;
  purpose: string;
  visitDate: string;
  visitTime: string;
  relatedBookingId?: string;
  notes?: string;
}

export const visitorApi = {
  createVisitor: (data: VisitorData) => api.post('/visitors', data),
  getAllVisitors: () => api.get('/visitors'),
  getVisitorById: (id: string) => api.get(`/visitors/${id}`),
  updateStatus: (id: string, status: string) => api.put(`/visitors/${id}/status`, { status }),
  deleteVisitor: (id: string) => api.delete(`/visitors/${id}`),
};
