import axios from 'axios';
import { toast } from 'react-toastify';
import { localStorageService } from '@shared/lib/storage';
import { authService } from '@entities/user';
import { VITE_API_ENDPOINT } from '../../config/config';
import logger from '../logger/logger';

const http = axios.create({
  baseURL: VITE_API_ENDPOINT,
});

http.interceptors.request.use(
  async (config) => {
    const expiresDate = localStorageService.getTokenExpiresDate();
    const refreshToken = localStorageService.getRefreshToken();
    const isExpired = refreshToken && expiresDate < Date.now();

    if (isExpired) {
      try {
        const newTokens = await authService.refresh();
        localStorageService.setTokens(newTokens);
      } catch (error) {
        localStorageService.removeAuthData();
      }
    }

    const accessToken = localStorageService.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
  (res) => {
    res.data = { content: res.data };
    return res;
  },
  (error) => {
    const expectedErrors =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;

    if (!expectedErrors) {
      console.log(error);
      logger.log(error);
      toast.error('Something was wrong. Try it later');
    }

    return Promise.reject(error);
  }
);

const httpService = {
  get: http.get,
  post: http.post,
  put: http.put,
  delete: http.delete,
  patch: http.patch,
};

export default httpService;
