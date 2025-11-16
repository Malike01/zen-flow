import api from './axiosConfig';

export interface ITag {
  _id: string;
  user: string;
  name: string;
  color: string;
}

export const getTags = async (): Promise<ITag[]> => {
  const { data } = await api.get('/api/tags');
  return data;
};

export const createTag = async (payload: { name: string; color: string }): Promise<ITag> => {
  const { data } = await api.post('/api/tags', payload);
  return data;
};

export const updateTag = async (tagId: string, payload: { name: string; color: string }): Promise<ITag> => {
  const { data } = await api.put(`/api/tags/${tagId}`, payload);
  return data;
};

export const deleteTag = async (tagId: string): Promise<void> => {
  await api.delete(`/api/tags/${tagId}`);
};