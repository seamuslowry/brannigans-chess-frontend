import axios from 'axios';
import config from '../config';

export const chessApi = axios.create({
  baseURL: config.serviceUrl
});

// Add a request interceptor
chessApi.interceptors.request.use(axiosConfig => {
  const token = localStorage.getItem('token');

  if (!token) return axiosConfig;

  return {
    ...axiosConfig,
    headers: {
      ...axiosConfig.headers,
      Authorization: `Bearer ${token}`
    }
  };
});
