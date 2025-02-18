import React, { useEffect, useState } from 'react';
import { FlatList, Modal, View } from 'react-native';
import { ContentInput } from '@/src/screens/Feed/ui/components/ContentInput';
import { BackButton } from '@/src/shared/ui/BackButton';
import { Post } from '@/src/screens/Feed/ui/components/Post';
import { ActivityIndicator } from 'react-native-paper';
import { useGetPosts } from '@/src/shared/api/hooks/PostHooks/useGetPosts';
import { CommentsModal } from '@/src/screens/Feed/ui/components/CommentsModal';
import { useQueryClient } from '@tanstack/react-query';

import ImageView from 'react-native-image-viewing';
import { ImageSource } from 'expo-image';
import { useCheckSubscription } from '@/src/shared/hooks/useCheckSubscription';

export const Feed = () => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    postId: string | null;
  }>({
    isOpen: false,
    postId: null,
  });
  const [isVisibleImageViewer, setIsVisibleImageViewer] = useState(false);
  const [currImage, setCurrImage] = useState<ImageSource[]>();

  const queryClient = useQueryClient();
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading } =
    useGetPosts();

  useEffect(
    () => () => {
      queryClient.resetQueries({ queryKey: ['posts'] });
    },
    [],
  );

  useCheckSubscription();

  return (
    <View className={'flex-1'}>
      <View className={'flex-1 flex flex-col px-4 py-4 pb-10'}>
        <View className={'flex flex-col gap-2 mb-10'}>
          <BackButton />
          <ContentInput />
        </View>
        {isLoading ? (
          <ActivityIndicator color={'white'} />
        ) : (
          <FlatList
            data={data?.pages.flatMap((page) => page.data.posts)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Post
                name={item.profile.name}
                avatar={item.profile.avatar}
                content={item.content}
                image={item.imageUrl}
                comments={item._count.comments}
                openCommentsModal={() => setModalState({ isOpen: true, postId: item.id })}
                setCurrImage={setCurrImage}
                setIsVisibleImageViewer={setIsVisibleImageViewer}
              />
            )}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.1}
            ListFooterComponent={
              isFetchingNextPage ? (
                <ActivityIndicator size={'large'} color="white" />
              ) : null
            }
            style={{ flex: 1 }}
            className={'pb-10'}
          />
        )}
      </View>
      <Modal
        visible={modalState.isOpen && !!modalState.postId}
        transparent={false}
        animationType={'slide'}
        presentationStyle={'formSheet'}
        onRequestClose={() => setModalState({ isOpen: false, postId: null })}
      >
        <CommentsModal
          closeModal={() => setModalState({ isOpen: false, postId: null })}
          postId={modalState.postId!}
        />
      </Modal>
      <ImageView
        images={currImage!}
        imageIndex={0}
        visible={isVisibleImageViewer}
        onRequestClose={() => setIsVisibleImageViewer(false)}
      />
    </View>
  );
};
