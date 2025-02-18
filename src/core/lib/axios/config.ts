import axios, { CreateAxiosDefaults } from 'axios';
import { supabase } from '@/src/core/lib/supabase';
import { router } from 'expo-router';
import { AuthHelpers } from '@/src/shared/lib/helpers/auth.helpers';

const options: CreateAxiosDefaults = {
  baseURL: process.env.EXPO_PUBLIC_BACKEND_URL,
  headers: { 'Content-Type': 'application/json' },
};

export const axiosAuth = axios.create(options);
export const axiosClassic = axios.create(options);

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

      await AuthHelpers.logout();
      router.replace('/auth');
    }

    throw error;
  },
);
