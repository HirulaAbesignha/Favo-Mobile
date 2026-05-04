import api from './axiosConfig';

export interface BookingData {
  itemId: string;
  rentalStartDate: string;
  rentalEndDate: string;
  totalAmount: number;
  notes?: string;
}

export const bookingApi = {
  createBooking: (data: BookingData) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getAllBookings: () => api.get('/bookings'),
  getBookingById: (id: string) => api.get(`/bookings/${id}`),
  updateStatus: (id: string, status: string) => api.put(`/bookings/${id}/status`, { status }),
  cancelBooking: (id: string) => api.put(`/bookings/${id}/cancel`),
  deleteBooking: (id: string) => api.delete(`/bookings/${id}`),
};
