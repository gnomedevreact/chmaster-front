import axios, { CreateAxiosDefaults } from 'axios';
import { supabase } from '@/src/core/lib/supabase';

const options: CreateAxiosDefaults = {
  baseURL: process.env.EXPO_PUBLIC_BACKEND_URL,
  headers: { 'Content-Type': 'application/json' },
};

export const axiosAuth = axios.create(options);

axiosAuth.interceptors.request.use(async (config) => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (session?.access_token && config.headers) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }

  return config;
});

axiosAuth.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originalRequest = error.config;

    if (error.status === 401 && error.config && !originalRequest._isRetry) {
      const { data, error: sessionError } = await supabase.auth.refreshSession();

      if (!sessionError) {
        return axiosAuth.request(error.config);
      }

      await supabase.auth.signOut();
    }

    throw error;
  },
);
