import api from './axiosConfig';

interface UserSettings {
  enableMusic: boolean;
}

export const updateUserSettings = async (payload: UserSettings): Promise<UserSettings> => {
  const { data } = await api.put('/api/users/settings', payload);
  return data;
};