import React from 'react';
import { Image, Pressable, View } from 'react-native';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { toast } from '@/src/shared/lib/utils/toast';
import { supabase } from '@/src/core/lib/supabase';
import { formatError } from '@/src/shared/lib/utils/formatError';

import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import { useUploadAvatar } from '@/src/shared/api/hooks/useUploadAvatar';
import { useProfileStore } from '@/src/core/lib/store/profile.store';

interface AvatarProps {
  name: string;
}

export const Avatar = (props: AvatarProps) => {
  const { name } = props;

  const profile = useProfileStore((state) => state.profileData);

  const { uploadAvatar } = useUploadAvatar();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled) {
      await uploadImage(result.assets[0].base64);
    }
  };

  const uploadImage = async (image: string | undefined | null) => {
    if (!image) {
      toast({
        message: 'Please, upload the image',
        type: 'danger',
      });

      return;
    }

    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(`${profile?.user_id}_image.png`, decode(image), {
          cacheControl: '3600',
          upsert: true,
          contentType: 'image/png',
        });

      if (error) throw error;

      const { data: fromStorage } = supabase.storage
        .from('avatars')
        .getPublicUrl(data?.path);

      uploadAvatar(fromStorage.publicUrl);

      toast({
        message: 'Successfully uploaded',
        type: 'success',
      });
    } catch (error: any) {
      toast({
        message: formatError(error),
        type: 'danger',
      });
    }
  };

  return (
    <View className={'flex flex-col gap-3 items-center justify-center pt-10'}>
      <Pressable
        className={
          'flex items-center justify-center rounded-full bg-primary-200 overflow-hidden'
        }
        style={{ width: 150, height: 150 }}
        onPress={pickImage}
      >
        {profile?.avatar ? (
          <Image
            source={{
              uri: `${profile.avatar}?t=${new Date().getTime()}`,
            }}
            className={'w-[150px] h-[150px]'}
          />
        ) : (
          <TextStyled className={'text-[62px]'}>
            {name.substring(0, 2).toUpperCase()}
          </TextStyled>
        )}
      </Pressable>
      <TextStyled className={'text-[28px]'}>
        {name.substring(0, 1).toUpperCase() + name.substring(1)}
      </TextStyled>
    </View>
  );
};
