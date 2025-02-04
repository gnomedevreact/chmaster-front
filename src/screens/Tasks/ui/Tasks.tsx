import React from 'react';
import { Container } from '@/src/widgets/Container';
import { TasksList } from '@/src/features/TasksList';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { View } from 'react-native';

export const Tasks = () => {
  return (
    <Container className={'py-4'}>
      <View className={'flex flex-col gap-1 mb-10'}>
        <TextStyled className={'text-[32px]'} fontFamilyName={'NunitoSansBold'}>
          Puzzle Challenges
        </TextStyled>
        <TextStyled className={'text-lg text-primary-600'}>
          Explore a collection of chess puzzles covering various themes and difficulty
          levels. Sharpen your tactical skills, improve your strategic thinking, and
          challenge yourself with engaging chess problems designed to enhance your
          gameplay.
        </TextStyled>
      </View>
      <TasksList />
    </Container>
  );
};
