import { axiosAuth } from '@/src/core/lib/axios/config';

export const EngineService = {
  async getFenEvaluation(fen: string) {
    return await axiosAuth.post<{ fen: string; evaluation: number }>('/engine/evaluate', {
      fen,
    });
  },
};
