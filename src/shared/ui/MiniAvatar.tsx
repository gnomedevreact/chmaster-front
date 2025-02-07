import React from 'react';
import { Image, View } from 'react-native';
import { TextStyled } from '@/src/shared/ui/TextStyled';

export const MiniAvatar = ({
  profileAvatar: { avatarUri, name },
}: {
  profileAvatar: { avatarUri: string; name: string };
}) => {
  return (
    <View
      className={
        'flex items-center justify-center w-14 h-14 rounded-full overflow-hidden bg-primary-500'
      }
    >
      {avatarUri && <Image source={{ uri: avatarUri }} className={'w-14 h-14'} />}
      {!avatarUri && <TextStyled>{name.substring(0, 2).toUpperCase()}</TextStyled>}
    </View>
  );
};
