import React from 'react';
import { Image, Pressable, View } from 'react-native';
import { MiniAvatar } from '@/src/shared/ui/MiniAvatar';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { FontAwesome5 } from '@expo/vector-icons';
import { ImageSource } from 'expo-image';

interface PostProps {
  content: string;
  image?: string | null;
  name: string;
  avatar: string;
  comments: number;
  openCommentsModal: () => void;
  setIsVisibleImageViewer: (e: boolean) => void;
  setCurrImage: (e: ImageSource[]) => void;
}

export const Post = (props: PostProps) => {
  const {
    image,
    content,
    name,
    avatar,
    comments,
    openCommentsModal,
    setCurrImage,
    setIsVisibleImageViewer,
  } = props;

  return (
    <View className={'bg-primary-200 p-4 rounded-[14px] mb-4'}>
      <View className={'flex flex-col gap-2'}>
        <View className={'flex flex-row gap-3 items-center mb-4'}>
          <MiniAvatar profileAvatar={{ avatarUri: avatar, name }} />
          <TextStyled fontFamilyName={'NunitoSansBold'}>{name}</TextStyled>
          <Pressable
            className={'ml-auto flex flex-row gap-2 items-center'}
            onPress={openCommentsModal}
          >
            <FontAwesome5 name="comment-alt" size={20} color="#6D6D6D" />
            <TextStyled className={'text-primary-600'}>{comments}</TextStyled>
          </Pressable>
        </View>
        <TextStyled className={'mb-4'}>{content}</TextStyled>
      </View>
      {image && (
        <Pressable
          onPress={() => {
            setCurrImage([{ uri: image }]);
            setIsVisibleImageViewer(true);
          }}
        >
          <Image
            source={{
              uri: image,
            }}
            style={{
              width: 'auto',
              height: 150,
              resizeMode: 'cover',
            }}
          />
        </Pressable>
      )}
    </View>
  );
};
