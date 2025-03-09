import React, { useState } from 'react';
import { Container } from '@/src/widgets/Container';
import { BackButton } from '@/src/shared/ui/BackButton';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { View } from 'react-native';
import { ExercisesList } from '@/src/screens/Plan/ui/components/ExercisesList';
import { ExerciseType } from '@/src/shared/model/types/exercises.types';
import { ExerciseModal } from '@/src/screens/Plan/ui/components/ExerciseModal';

export const Plan = () => {
  const [activeExercise, setActiveExercise] = useState<{
    exercise: ExerciseType;
    orderNum: number;
    phase: number;
  }>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  return (
    <Container className={'py-4'}>
      <BackButton />
      <View className={'flex flex-col gap-1 mb-10'}>
        <TextStyled className={'text-lg text-primary-600'}>
          Improve your chess skills with daily exercises. Solve puzzles, analyze games,
          and learn new strategies every day to level up your play.
        </TextStyled>
        <TextStyled className={'text-sm text-primary-500'}>
          (New Phases and Exercises Coming Soon)
        </TextStyled>
      </View>
      <ExercisesList
        setActiveExercise={setActiveExercise}
        openModal={() => setModalVisible(true)}
      />
      {activeExercise && (
        <ExerciseModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          activeExercise={activeExercise}
        />
      )}
    </Container>
  );
};
