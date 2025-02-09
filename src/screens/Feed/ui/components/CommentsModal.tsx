import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useGetComments } from '@/src/shared/api/hooks/PostHooks/useGetComments';
import { BackButton } from '@/src/shared/ui/BackButton';
import { CommentBlock } from '@/src/screens/Feed/ui/components/CommentBlock';

import { Input } from '@/src/shared/ui/Input';
import { Button } from '@/src/shared/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { useAddComment } from '@/src/shared/api/hooks/PostHooks/useAddComment';
import FlashMessage from 'react-native-flash-message';
import { useQueryClient } from '@tanstack/react-query';

interface CommentsModalProps {
  closeModal: () => void;
  postId: string;
}

interface FormProps {
  content: string;
}

export const CommentsModal = (props: CommentsModalProps) => {
  const { closeModal, postId } = props;

  const toastRef = useRef<FlashMessage>(null);

  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm<FormProps>({
    reValidateMode: 'onBlur',
    mode: 'onBlur',
    defaultValues: {
      content: '',
    },
  });

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } = useGetComments(postId);
  const { addComment, isPending } = useAddComment(toastRef);

  const submit = ({ content }: FormProps) => {
    addComment({ content, postId });
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  useEffect(
    () => () => {
      queryClient.resetQueries({ queryKey: ['comments'] });
    },
    [],
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={40}
      style={{ flex: 1 }}
      className={'bg-primary-400 px-4 py-10'}
    >
      <BackButton customPress={closeModal} className={'mb-10'} />
      <FlatList
        data={data?.pages.flatMap((page) => page.data.comments)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CommentBlock profile={item.profile} content={item.content} key={item.id} />
        )}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          isFetchingNextPage ? <ActivityIndicator size={'large'} color="white" /> : null
        }
        contentContainerStyle={{ flexGrow: 1 }}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className={'bg-primary-400 pb-10'}>
          <View className={'flex flex-row items-center gap-2 p-4 bg-primary-400'}>
            <Input
              control={control}
              name={'content'}
              wrapClassname={'flex-1'}
              placeholder={'Leave a comment...'}
              multiline={true}
              rules={{
                required: true,
              }}
            />
            <Button
              className={'w-[50px]'}
              onPress={handleSubmit(submit)}
              disabled={isPending}
            >
              <Ionicons name="send" size={24} color="white" />
            </Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <FlashMessage
        ref={toastRef}
        position="top"
        style={{ zIndex: 9999, elevation: 9999 }}
        floating={true}
      />
    </KeyboardAvoidingView>
  );
};
