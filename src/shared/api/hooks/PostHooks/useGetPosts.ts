import { useInfiniteQuery } from '@tanstack/react-query';
import { PostService } from '@/src/shared/api/services/post.service';

export const useGetPosts = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['posts'],
      queryFn: ({ pageParam = null }: { pageParam: string | null }) =>
        PostService.getPosts(pageParam),
      initialPageParam: null,
      getNextPageParam: (lastPage) => lastPage.data.nextCursor,
    });

  return { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading };
};
