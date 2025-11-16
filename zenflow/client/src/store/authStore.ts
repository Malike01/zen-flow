import { create } from "zustand";
import { persist } from "zustand/middleware";


interface AuthData {
  _id: string;
  email: string;
  settings: {
    enableMusic: boolean;
  };
  token: string;
}

interface AuthState {
  user: {
    _id: string | null;
    email: string | null;
    settings: {
      enableMusic: boolean;
    };
  };
  token: string | null;
  isAuthenticated: boolean;

  login: (data: AuthData) => void; 
  logout: () => void; 
  updateSettings: (settings: AuthData['settings']) => void; 
}
export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: {
        _id: null,
        email: null,
        settings: { enableMusic: true },
      },
      token: null,
      isAuthenticated: false,

      login: (data) =>
        set({
          user: {
            _id: data._id,
            email: data.email,
            settings: data.settings,
          },
          token: data.token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: { _id: null, email: null, settings: { enableMusic: true } },
          token: null,
          isAuthenticated: false,
        }),
      
      updateSettings: (settings) => 
        set((state) => ({
          user: { ...state.user, settings }
        })),
    }),
    {
      name: 'zenflow-auth-storage', 
    }
  )
);