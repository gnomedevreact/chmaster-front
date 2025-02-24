import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PostService } from '@/src/shared/api/services/post.service';
import { formatError } from '@/src/shared/lib/utils/formatError';
import { RefObject } from 'react';
import FlashMessage from 'react-native-flash-message';

export const useAddComment = (toastRef: RefObject<FlashMessage>) => {
  const queryClient = useQueryClient();

  const { mutate: addComment, isPending } = useMutation({
    mutationKey: ['comments'],
    mutationFn: (data: { content: string; postId: string }) =>
      PostService.addComment(data),
    onSuccess() {
      toastRef?.current?.showMessage({
        message: 'Comment successfully created',
        type: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError(error: any) {
      toastRef?.current?.showMessage({
        message: formatError(error.response),
        type: 'danger',
      });
    },
  });

  return { addComment, isPending };
};
