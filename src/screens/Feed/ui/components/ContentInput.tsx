import React, { useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import { Input } from '@/src/shared/ui/Input';
import { Button } from '@/src/shared/ui/Button';
import { useForm } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { useCreatePost } from '@/src/shared/api/hooks/PostHooks/useCreatePost';
import { TextStyled } from '@/src/shared/ui/TextStyled';

interface FormProps {
  content: string;
}

export const ContentInput = () => {
  const [image, setImage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm<FormProps>({
    reValidateMode: 'onBlur',
    mode: 'onBlur',
  });
  const { createPost, isPending } = useCreatePost();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const removeImage = () => setImage(null);

  const submit = ({ content }: FormProps) => {
    let formData = new FormData();

    removeImage();

    formData.append('content', content);

    if (image) {
      formData.append('image', {
        uri: image,
        name: 'image.jpg',
        type: 'image/jpeg',
      } as any);
    }

    createPost(formData);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <View>
      <View className={'flex flex-row items-center gap-1'}>
        <Input
          control={control}
          rules={{ required: true }}
          name={'content'}
          placeholder={'Write something...'}
          wrapClassname={'flex-1'}
          multiline={true}
        />
        <Button className={'p-3'} onPress={image ? removeImage : pickImage}>
          {image ? (
            <Entypo name="cross" size={24} color="white" />
          ) : (
            <Ionicons name="attach" size={24} color="white" />
          )}
        </Button>
      </View>
      <Button
        className={'p-4 mt-2'}
        onPress={handleSubmit(submit)}
        disabled={isPending}
        isLoading={isPending}
      >
        <TextStyled className={'text-base'}>Publish</TextStyled>
      </Button>
      {image && (
        <View className={'p-1'}>
          <Image
            source={{ uri: image }}
            style={{ width: 100, height: 100, borderRadius: 10 }}
          />
        </View>
      )}
    </View>
  );
};
