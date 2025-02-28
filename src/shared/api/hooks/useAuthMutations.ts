import { useMutation } from '@tanstack/react-query';
import { AuthService } from '@/src/shared/api/services/auth.service';
import { toast } from '@/src/shared/lib/utils/toast';
import { formatError } from '@/src/shared/lib/utils/formatError';

export const useAuthMutations = () => {
  const { mutate: signUpMutation, isPending } = useMutation({
    mutationKey: ['signup'],
    mutationFn: (data: { email: string; password: string }) => AuthService.signUp(data),
    async onSuccess() {
      toast({
        message: 'Now you can login to application',
        type: 'success',
      });
    },
    async onError(error: any) {
      toast({
        type: 'danger',
        message: formatError(error.response),
      });
    },
  });

  return { signUpMutation, isPending };
};
