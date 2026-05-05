import api from './axiosConfig';

export interface ItemData {
  itemName: string;
  category: string;
  sizes: { size: string; stock: number }[];
  color: string;
  price: number;
  description?: string;
  itemType?: string;
  availabilityStatus?: string;
}

export const itemApi = {
  getItems: (params?: { category?: string; size?: string; availabilityStatus?: string }) =>
    api.get('/items', { params }),
  getItemById: (id: string) => api.get(`/items/${id}`),
  createItem: (data: ItemData) => api.post('/items', data),
  updateItem: (id: string, data: Partial<ItemData>) => api.put(`/items/${id}`, data),
  deleteItem: (id: string) => api.delete(`/items/${id}`),
  uploadImage: (id: string, formData: FormData) =>
    api.post(`/items/${id}/upload`, formData),
};
