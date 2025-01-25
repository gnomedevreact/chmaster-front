import { useMutation } from '@tanstack/react-query';
import { EngineService } from '@/src/shared/api/services/engine.service';

export const useEvaluateFen = () => {
  const {
    mutate: evaluateFen,
    data: evaluation,
    isPending,
    reset: resetData,
  } = useMutation({
    mutationKey: ['evaluate'],
    mutationFn: (fen: string) => EngineService.getFenEvaluation(fen),
  });

  return { evaluateFen, evaluation, isPending, resetData };
};
