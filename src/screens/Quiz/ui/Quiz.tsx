import React, { useState } from 'react';
import { Container } from '@/src/widgets/Container';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/src/shared/ui/Button';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import Test from '@/src/screens/Quiz/ui/components/Test';

import Horse from '../../../assets/images/horse.svg';
import Horse2 from '../../../assets/images/horse2.svg';
import { useCheckSubscription } from '@/src/shared/hooks/useCheckSubscription';

export const Quiz = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isWhite, setIsWhite] = useState<boolean>();
  const { back } = useRouter();

  useCheckSubscription();

  const startTest = () => {
    return currentIndex === 1 ? setIsWhite(true) : setIsWhite(false);
  };

  return (
    <Container className={'py-4 pb-10'}>
      <View className={'flex flex-row gap-6 items-center mb-12'}>
        <Button className={'w-[50px] h-[50px]'} isLight={false} onPress={() => back()}>
          <Ionicons name="arrow-back" size={20} color="white" />
        </Button>
        <View>
          <TextStyled className={'text-[28px]'}>Opening test</TextStyled>
          <TextStyled className={'text-base text-primary-600'}>
            Find out best chess opening for your style
          </TextStyled>
        </View>
      </View>
      {isWhite === undefined && (
        <View className={'flex flex-col gap-4'}>
          <Pressable
            className={
              'flex flex-row gap-4 items-center p-4 bg-primary-200 rounded-[14px]'
            }
            style={{
              shadowColor: currentIndex === 1 ? '#DA0C81' : '#71797E',
              shadowOffset: { width: 1, height: 1 },
              shadowOpacity: 0.4,
              shadowRadius: currentIndex === 1 ? 6 : 2,
              elevation: currentIndex === 1 ? 6 : 2,
            }}
            onPress={() => setCurrentIndex(1)}
          >
            <View
              className={
                'flex items-center justify-center bg-[#161616] w-[60px] h-[60px] rounded-full'
              }
            >
              <Horse />
            </View>
            <TextStyled className={'text-[20px]'} fontFamilyName={'NunitoSansBold'}>
              White
            </TextStyled>
          </Pressable>
          <Pressable
            className={
              'flex flex-row gap-4 items-center p-4 bg-primary-200 rounded-[14px]'
            }
            style={{
              shadowColor: currentIndex === 2 ? '#DA0C81' : '#71797E',
              shadowOffset: { width: 1, height: 1 },
              shadowOpacity: 0.4,
              shadowRadius: currentIndex === 2 ? 6 : 2,
              elevation: currentIndex === 2 ? 6 : 2,
            }}
            onPress={() => setCurrentIndex(2)}
          >
            <View
              className={
                'flex items-center justify-center bg-primary-white w-[60px] h-[60px] rounded-full'
              }
            >
              <Horse2 />
            </View>
            <TextStyled className={'text-[20px]'} fontFamilyName={'NunitoSansBold'}>
              Black
            </TextStyled>
          </Pressable>
        </View>
      )}
      {isWhite !== undefined && <Test isWhite={isWhite} />}
      {isWhite === undefined && (
        <Button className={'mt-auto'} onPress={startTest}>
          <TextStyled className={'text-lg'}>Confirm</TextStyled>
        </Button>
      )}
    </Container>
  );
};
