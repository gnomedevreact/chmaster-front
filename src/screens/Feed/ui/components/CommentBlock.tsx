import React from 'react';
import { View } from 'react-native';
import { MiniAvatar } from '@/src/shared/ui/MiniAvatar';
import { ProfileType } from '@/src/shared/model/types/profile.types';
import { TextStyled } from '@/src/shared/ui/TextStyled';

interface CommentBlockProps {
  profile: ProfileType;
  content: string;
}

export const CommentBlock = (props: CommentBlockProps) => {
  const { profile, content } = props;

  return (
    <View className={'p-2 rounded border-l border-primary-100 mb-8'}>
      <View className={'flex flex-row gap-2'}>
        <MiniAvatar
          profileAvatar={{ avatarUri: profile.avatar, name: profile.name }}
          className={'w-8 h-8'}
          textClassName={'text-base'}
        />
        <View>
          <TextStyled
            className={'text-base text-primary-600'}
          >{`@${profile.name}`}</TextStyled>
          <TextStyled className={'text-lg'}>{content}</TextStyled>
        </View>
      </View>
    </View>
  );
};
