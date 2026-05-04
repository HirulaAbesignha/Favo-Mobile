import api from './axiosConfig';

export interface PaymentData {
  bookingId: string;
  amount: number;
  paymentMethod: string;
}

export const paymentApi = {
  createPayment: (data: PaymentData) => api.post('/payments', data),
  getMyPayments: () => api.get('/payments/my-payments'),
  getAllPayments: () => api.get('/payments'),
  getPaymentById: (id: string) => api.get(`/payments/${id}`),
  updateStatus: (id: string, paymentStatus: string) =>
    api.put(`/payments/${id}/status`, { paymentStatus }),
  deletePayment: (id: string) => api.delete(`/payments/${id}`),
};
