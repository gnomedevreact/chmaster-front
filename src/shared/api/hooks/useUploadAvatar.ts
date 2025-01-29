import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileService } from '@/src/shared/api/services/profile.service';
import { toast } from '@/src/shared/lib/utils/toast';
import { formatError } from '@/src/shared/lib/utils/formatError';

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  const { mutate: uploadAvatar } = useMutation({
    mutationKey: ['upload avatar'],
    mutationFn: (uri: string) => ProfileService.uploadAvatar(uri),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError(error: any) {
      toast({
        message: formatError(error),
        type: 'danger',
      });
    },
  });

  return { uploadAvatar };
};
