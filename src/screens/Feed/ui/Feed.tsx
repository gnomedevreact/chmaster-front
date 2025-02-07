import React from 'react';
import { FlatList, KeyboardAvoidingView, Platform, View } from 'react-native';
import { ContentInput } from '@/src/screens/Feed/ui/components/ContentInput';
import { BackButton } from '@/src/shared/ui/BackButton';
import { Post } from '@/src/screens/Feed/ui/components/Post';
import { ActivityIndicator } from 'react-native-paper';
import { PostService } from '@/src/shared/api/services/post.service';
import { useInfiniteQuery } from '@tanstack/react-query';

export const Feed = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = null }: { pageParam: string | null }) =>
      PostService.getPosts(pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.data.nextCursor,
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={40}
      style={{ flex: 1 }}
    >
      <View className={'flex-1 flex flex-col px-4 py-4 pb-10'}>
        <View className={'flex flex-col gap-2 mb-10'}>
          <BackButton />
          <ContentInput />
        </View>
        <FlatList
          data={data?.pages.flatMap((page) => page.data.posts)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Post
              name={item.profile.name}
              avatar={item.profile.avatar}
              content={item.content}
              image={item.imageUrl}
            />
          )}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? <ActivityIndicator size={'large'} color="white" /> : null
          }
          style={{ flex: 1 }}
          className={'pb-10'}
        />
      </View>
    </KeyboardAvoidingView>
  );
};
