import { http } from './http.js';

export const productsApi = {
  list: () => http.get('/products'),
};

export const ordersApi = {
  list: () => http.get('/orders'),
  create: (order) => http.post('/orders', order),
};
