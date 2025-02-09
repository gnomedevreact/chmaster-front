import React from 'react';
import { Image, View } from 'react-native';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { cn } from '@/src/shared/lib/utils/cnUtils';

export const MiniAvatar = ({
  profileAvatar: { avatarUri, name },
  className,
  textClassName,
}: {
  profileAvatar: { avatarUri: string; name: string };
  className?: string;
  textClassName?: string;
}) => {
  return (
    <View
      className={cn(
        'flex items-center justify-center w-14 h-14 rounded-full overflow-hidden bg-primary-500',
        className,
      )}
    >
      {avatarUri && <Image source={{ uri: avatarUri }} className={'w-full h-full'} />}
      {!avatarUri && (
        <TextStyled className={cn(textClassName)}>
          {name.substring(0, 2).toUpperCase()}
        </TextStyled>
      )}
    </View>
  );
};
