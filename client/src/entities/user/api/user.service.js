import httpService from '@shared/lib/api/httpService';
import { localStorageService } from '@shared/lib/storage';

const userEndpoint = '/user/';

const userService = {
  get: async () => {
    const { data } = await httpService.get(userEndpoint);
    return data;
  },
  create: async (payload) => {
    const { data } = await httpService.put(userEndpoint + payload._id, payload);
    return data;
  },
  getCurrentUser: async () => {
    const { data } = await httpService.get(
      userEndpoint + localStorageService.getUserId()
    );
    return data;
  },
  update: async (payload) => {
    const { data } = await httpService.patch(
      userEndpoint + localStorageService.getUserId(),
      payload
    );
    return data;
  },

  updateById: async (userId, payload) => {
    const { data } = await httpService.patch(`user/${userId}`, payload);
    return data;
  },

  likeUser: async (userId) => {
    const { data } = await httpService.post(`user/${userId}/like`);
    return data;
  },
  favoriteUser: async (userId) => {
    const url = `${userEndpoint}${userId}/favorite`;
    const { data: content } = await httpService.post(url);
    return content;
  },
};
export default userService;
