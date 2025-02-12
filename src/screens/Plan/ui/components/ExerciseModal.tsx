import React from 'react';
import { Modal, View } from 'react-native';
import { ExerciseType } from '@/src/shared/model/types/exercises.types';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { Button } from '@/src/shared/ui/Button';
import { useProfileStore } from '@/src/core/lib/store/profile.store';
import { ActivityIndicator } from 'react-native-paper';
import { cn } from '@/src/shared/lib/utils/cnUtils';
import { useCompleteExercise } from '@/src/shared/api/hooks/ExercisesHooks/useCompleteExercise';
import { BackButton } from '@/src/shared/ui/BackButton';

interface ExerciseModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  activeExercise: {
    exercise: ExerciseType;
    orderNum: number;
    phase: number;
  };
}

export const ExerciseModal = (props: ExerciseModalProps) => {
  const {
    modalVisible,
    setModalVisible,
    activeExercise: { exercise, orderNum, phase },
  } = props;

  const profileData = useProfileStore((state) => state.profileData);
  const { completeExercise, isPendingCompletion } = useCompleteExercise({
    closeModal: () => setModalVisible(false),
  });

  if (!profileData) {
    return <ActivityIndicator color={'#FAFAFA'} />;
  }

  const currentExercise =
    profileData.current_phase > 1
      ? profileData.current_exercise + 25 * (profileData.current_phase - 1)
      : profileData.current_exercise;
  const actualOrderNum = phase > 1 ? orderNum + 25 * (phase - 1) : orderNum;

  const isCompleted = currentExercise > actualOrderNum;

  return (
    <Modal
      visible={modalVisible}
      presentationStyle={'formSheet'}
      animationType={'slide'}
      className={'flex-1'}
      onRequestClose={() => setModalVisible(false)}
    >
      <View className={'flex-1 flex flex-col gap-2 px-4 py-10 bg-primary-400'}>
        <BackButton customPress={() => setModalVisible(false)} />
        <TextStyled className={'text-[24px]'} fontFamilyName={'NunitoSansBold'}>
          {exercise.title}
        </TextStyled>
        <TextStyled className={'text-lg text-primary-600'}>
          {exercise.description}
        </TextStyled>
        <Button
          className={cn('mt-auto mb-12', { 'bg-[#4F7942]': isCompleted })}
          isLoading={isPendingCompletion}
          disabled={isPendingCompletion || isCompleted}
          onPress={isCompleted ? undefined : completeExercise}
        >
          <TextStyled className={'text-base'}>
            {isCompleted ? 'Completed' : 'Complete'}
          </TextStyled>
        </Button>
      </View>
    </Modal>
  );
};
