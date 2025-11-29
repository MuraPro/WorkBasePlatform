import { httpAuth } from '@shared/lib/api';
import { localStorageService } from '@shared/lib/storage';

const authService = {
  register: async (payload) => {
    const { data } = await httpAuth.post('signUp', payload);
    return data;
  },

  login: async (payload) => {
    const { data } = await httpAuth.post('signWithPassword', payload);
    return data;
  },

  refresh: async () => {
    const { data } = await httpAuth.post('token', {
      refresh_token: localStorageService.getRefreshToken(),
    });
    return data;
  },
};

export default authService;
