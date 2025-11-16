import api from './axiosConfig';

interface AuthPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  _id: string;
  email: string;
  settings: {
    enableMusic: boolean;
  };
  token: string;
}

export const registerUser = async (payload: AuthPayload): Promise<AuthResponse> => {
  const { data } = await api.post('/api/auth/register', payload);
  return data;
};

export const loginUser = async (payload: AuthPayload): Promise<AuthResponse> => {
  const { data } = await api.post('/api/auth/login', payload);
  return data;
};