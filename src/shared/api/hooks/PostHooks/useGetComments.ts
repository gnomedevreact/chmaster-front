import { useInfiniteQuery } from '@tanstack/react-query';
import { PostService } from '@/src/shared/api/services/post.service';

export const useGetComments = (postId: string) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: ({ pageParam = null }: { pageParam: string | null }) =>
      PostService.getComments({ postId, cursor: pageParam }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.data.nextCursor,
    staleTime: 1000 * 60 * 5,
    enabled: !!postId,
  });

  return { data, fetchNextPage, hasNextPage, isFetchingNextPage };
};
