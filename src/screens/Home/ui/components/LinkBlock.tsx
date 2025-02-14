import React from 'react';
import { ImageBackground, ImageSourcePropType, Pressable, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { Button } from '@/src/shared/ui/Button';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { presentPaywallIfNeeded } from '@/src/shared/lib/utils/presentPaywall';

interface LinkBlockProps {
  title: string;
  image: ImageSourcePropType;
  link: any;
  subscription?: boolean;
}

export const LinkBlock = (props: LinkBlockProps) => {
  const { title, link, image, subscription } = props;

  const { push } = useRouter();

  const handleLink = async () => {
    if (subscription) {
      const isNeeded = await presentPaywallIfNeeded();
      if (isNeeded) {
        push(link);
      }

      return;
    }

    push(link);
  };

  return (
    <Pressable
      className={'w-full h-[150px] rounded-[8px] overflow-hidden'}
      onPress={handleLink}
    >
      <ImageBackground source={image} className={'h-full'}>
        <BlurView
          intensity={20}
          className={'h-full w-full p-3 flex flex-col justify-center items-start'}
        >
          <View className={'w-full flex flex-row items-center justify-between gap-2'}>
            <TextStyled
              fontFamilyName={'NunitoSansBold'}
              className={'text-[32px] text-wrap whitespace-pre max-w-[300px]'}
            >
              {title}
            </TextStyled>
            <Button className={'bg-primary-100 p-2'} onPress={handleLink}>
              <AntDesign name="arrowright" size={24} color="white" />
            </Button>
          </View>
        </BlurView>
      </ImageBackground>
    </Pressable>
  );
};
