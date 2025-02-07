import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PostService } from '@/src/shared/api/services/post.service';
import { toast } from '@/src/shared/lib/utils/toast';
import { formatError } from '@/src/shared/lib/utils/formatError';

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  const { mutate: createPost, isPending } = useMutation({
    mutationKey: ['create post'],
    mutationFn: (formData: FormData) => PostService.createPost(formData),
    onSuccess() {
      toast({
        message: 'Post successfully created',
        type: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError(error: any) {
      toast({
        message: formatError(error.response),
        type: 'danger',
      });
    },
  });

  return { createPost, isPending };
};
