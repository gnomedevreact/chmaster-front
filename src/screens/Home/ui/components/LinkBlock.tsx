import React from 'react';
import { ImageBackground, ImageSourcePropType, Pressable, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { Button } from '@/src/shared/ui/Button';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface LinkBlockProps {
  title: string;
  text: string;
  image: ImageSourcePropType;
  link: any;
}

export const LinkBlock = (props: LinkBlockProps) => {
  const { title, text, link, image } = props;

  const { push } = useRouter();

  return (
    <Pressable
      className={'w-full h-[100px] rounded-[8px] overflow-hidden'}
      onPress={() => push(link)}
    >
      <ImageBackground source={image} className={'h-full'}>
        <BlurView
          intensity={20}
          className={'h-full w-full p-3 flex flex-col justify-center items-start'}
        >
          <View className={'w-full flex flex-row items-center justify-between gap-2'}>
            <TextStyled fontFamilyName={'NunitoSansBold'} className={'text-[32px]'}>
              {title}
            </TextStyled>
            <Button className={'bg-primary-100 p-2'} onPress={() => push('/videos')}>
              <AntDesign name="arrowright" size={24} color="white" />
            </Button>
          </View>
        </BlurView>
      </ImageBackground>
    </Pressable>
  );
};
