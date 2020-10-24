import axios from 'axios';
import config from '../config';
import { store } from '../store/store';

export const chessApi = axios.create({
  baseURL: config.serviceUrl
});

// Add a request interceptor
chessApi.interceptors.request.use(axiosConfig => {
  const { token } = store.getState().auth;

  if (!token) return axiosConfig;

  return {
    ...axiosConfig,
    headers: {
      ...axiosConfig.headers,
      Authorization: `Bearer ${token}`
    }
  };
});
