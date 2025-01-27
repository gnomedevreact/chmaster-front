import { useMutation } from '@tanstack/react-query';
import { EngineService } from '@/src/shared/api/services/engine.service';
import { toast } from '@/src/shared/lib/utils/toast';
import { isAxiosError } from 'axios';

export const useEvaluateFen = () => {
  const {
    mutate: evaluateFen,
    data: evaluation,
    isPending,
    reset: resetData,
  } = useMutation({
    mutationKey: ['evaluate'],
    mutationFn: (fen: string) => EngineService.getFenEvaluation(fen),
    onError(error) {
      toast({
        type: 'danger',
        message: isAxiosError(error) && error?.response?.data.response.message,
      });
    },
  });

  return { evaluateFen, evaluation, isPending, resetData };
};
