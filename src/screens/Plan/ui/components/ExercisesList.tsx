import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { ExerciseType } from '@/src/shared/model/types/exercises.types';
import { convertToRoman } from '@/src/shared/lib/utils/convertToRoman';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Foundation, MaterialCommunityIcons } from '@expo/vector-icons';
import { cn } from '@/src/shared/lib/utils/cnUtils';
import { ActivityIndicator } from 'react-native-paper';
import { useGetExercises } from '@/src/shared/api/hooks/ExercisesHooks/useGetExercises';

const PHASES: Record<number, string> = {
  1: 'Preparatory Phase',
  2: 'Intermediate Phase',
  3: 'Advanced Phase',
};

const ExercisesSection = ({
  exercises,
  phase,
  currentExercise,
  currentPhase,
  setActiveExercise,
  openModal,
  exercise_done,
}: {
  exercises: ExerciseType[];
  phase: number;
  currentExercise: number;
  currentPhase: number;
  setActiveExercise: (e: {
    exercise: ExerciseType;
    orderNum: number;
    phase: number;
  }) => void;
  openModal: () => void;
  exercise_done: boolean;
}) => {
  const [isShown, setIsShown] = useState(false);

  const isLocked = phase > currentPhase;
  const isLockedUntilTomorrow = exercise_done;

  const currentExerciseRecalculated =
    phase > 1 ? currentExercise - (phase - 1) * 25 : currentExercise;

  return (
    <View
      className={cn('border-l border-primary-100 p-4', {
        'border-primary-300': isLocked,
      })}
    >
      <Pressable
        onPress={isLocked ? undefined : () => setIsShown(!isShown)}
        className={'mb-4'}
      >
        <TextStyled
          className={cn('text-[28px]', { 'text-primary-600': isLocked })}
          fontFamilyName={'NunitoSansBold'}
        >
          {`${convertToRoman(phase)}: ${PHASES[phase]}`}
        </TextStyled>
      </Pressable>
      {isShown && (
        <View className={'flex flex-col gap-2.5'}>
          {exercises.map((exercise, index) => (
            <Pressable
              className={'flex flex-row justify-between p-3 border-l border-primary-500'}
              onPress={
                currentExerciseRecalculated === index && isLockedUntilTomorrow
                  ? undefined
                  : currentExerciseRecalculated >= index
                    ? () => {
                        setActiveExercise({ exercise, orderNum: index, phase });
                        openModal();
                      }
                    : undefined
              }
              key={index}
            >
              <TextStyled className={'text-primary-600'}>
                {isLockedUntilTomorrow && currentExerciseRecalculated === index
                  ? 'Locked until tomorrow'
                  : `#${index + 1} Exercise (day ${index + 1})`}
              </TextStyled>
              <View className={'flex items-center justify-center w-10 h-10'}>
                {currentExerciseRecalculated === index && !isLockedUntilTomorrow && (
                  <MaterialCommunityIcons
                    name="progress-clock"
                    size={30}
                    color="#CC5500"
                  />
                )}
                {currentExerciseRecalculated > index && (
                  <Foundation name="check" size={30} color="#4CBB17" />
                )}
                {currentExerciseRecalculated < index && (
                  <FontAwesome name="lock" size={30} color="#71797E" />
                )}
                {currentExerciseRecalculated === index && isLockedUntilTomorrow && (
                  <MaterialCommunityIcons name="hours-24" size={30} color="#89CFF0" />
                )}
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

export const ExercisesList = ({
  setActiveExercise,
  openModal,
}: {
  setActiveExercise: (e: {
    exercise: ExerciseType;
    orderNum: number;
    phase: number;
  }) => void;
  openModal: () => void;
}) => {
  const { data, isLoading } = useGetExercises();

  if (isLoading || !data) {
    return <ActivityIndicator color={'#FAFAFA'} />;
  }

  const currentExercise =
    data.current_phase === 1
      ? data.current_exercise
      : data.current_phase === 2
        ? data.current_exercise + 25
        : data.current_exercise + 50;

  return (
    <View>
      {new Array(3).fill(0).map((_, index) => {
        const currentPhase = index + 1;
        const sliceStart = currentPhase < 3 ? index * 25 : 50;
        const sliceEnd = currentPhase < 3 ? currentPhase * 25 : undefined;

        return (
          <ExercisesSection
            exercises={data?.exercises.slice(sliceStart, sliceEnd)}
            phase={currentPhase}
            currentPhase={data.current_phase}
            currentExercise={currentExercise}
            setActiveExercise={setActiveExercise}
            openModal={openModal}
            exercise_done={data.exercise_done}
            key={index}
          />
        );
      })}
    </View>
  );
};
