import axios from 'axios';
import jwtDecode from 'jwt-decode';
import config from '../config';

export const chessApi = axios.create({
  baseURL: config.serviceUrl
});

// Add a request interceptor
chessApi.interceptors.request.use(axiosConfig => {
  const token = localStorage.getItem('token');

  if (!token) return axiosConfig;

  const claims = jwtDecode(token) as { exp: number };
  if (claims.exp * 1000 < Date.now()) {
    localStorage.removeItem('token');
    return axiosConfig;
  }

  return {
    ...axiosConfig,
    headers: {
      ...axiosConfig.headers,
      Authorization: `Bearer ${token}`
    }
  };
});
