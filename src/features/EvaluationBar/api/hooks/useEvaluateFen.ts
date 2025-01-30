import { useMutation } from '@tanstack/react-query';
import { EngineService } from '@/src/shared/api/services/engine.service';
import { toast } from '@/src/shared/lib/utils/toast';
import { formatError } from '@/src/shared/lib/utils/formatError';

export const useEvaluateFen = () => {
  const {
    mutate: evaluateFen,
    data: evaluation,
    isPending,
    reset: resetData,
  } = useMutation({
    mutationKey: ['evaluate'],
    mutationFn: (fen: string) => EngineService.getFenEvaluation(fen),
    onError(error: any) {
      toast({
        type: 'danger',
        message: formatError(error.response),
      });
    },
  });

  return { evaluateFen, evaluation, isPending, resetData };
};
