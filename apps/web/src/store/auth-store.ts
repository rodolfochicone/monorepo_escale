import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { authApi } from '@/services/api';

interface User {
  userId: number;
  username: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        loading: false,
        error: null,
        isAuthenticated: false,

        login: async (username: string, password: string) => {
          set({ loading: true, error: null });
          try {
            const response = await authApi.login({ username, password });
            const { access_token } = response;

            // Decode JWT to extract user info (basic decode for demo)
            const tokenPayload = JSON.parse(atob(access_token.split('.')[1]));
            const user = {
              userId: tokenPayload.sub,
              username: tokenPayload.username,
            };

            set({
              user,
              token: access_token,
              isAuthenticated: true,
              loading: false,
              error: null
            });

            toast.success(`Bem-vindo, ${user.username}!`);
            return true;
          } catch (error: any) {
            const errorMessage = error.message || 'Erro ao fazer login';
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            return false;
          }
        },

        logout: () => {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null
          });
          toast.success('Logout realizado com sucesso!');
        },

        clearError: () => set({ error: null }),
        setLoading: (loading: boolean) => set({ loading }),
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated
        }),
      }
    ),
    { name: 'auth-store' }
  )
);
