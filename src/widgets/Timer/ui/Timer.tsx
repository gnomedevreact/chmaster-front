import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { TIMER_SECONDS } from '@/src/features/ChessGame/lib/consts';
import { useFocusEffect } from 'expo-router';
import { Puzzle } from '@/src/shared/model/types/puzzles.types';

interface TimerProps {
  isActive: boolean;
  setIsActive: (e: boolean) => void;
  isReset: boolean;
  setIsReset: (e: boolean) => void;
  resetGameState: () => void;
  setIsStats: (e: boolean) => void;
  puzzlesCopy: Puzzle[];
}

export const Timer = (props: TimerProps) => {
  const {
    setIsActive,
    isActive,
    isReset,
    setIsReset,
    resetGameState,
    setIsStats,
    puzzlesCopy,
  } = props;

  const [seconds, setSeconds] = useState(TIMER_SECONDS);
  const [timerId, setTimerId] = useState<NodeJS.Timeout>();

  useEffect(() => {
    if (seconds === 0) {
      if (puzzlesCopy.length >= 10) {
        setIsStats(true);
      }
      clearInterval(timerId);
      setSeconds(TIMER_SECONDS);
      setIsReset(false);
      resetGameState();
      return;
    }

    if (isActive) {
      const id = setInterval(() => {
        setSeconds((prevSeconds: number) => prevSeconds - 1);
      }, 1000);

      setTimerId(id);

      return () => clearInterval(id);
    }
  }, [isActive, seconds]);

  useEffect(() => {
    if (isReset) {
      setIsActive(false);
      setSeconds(TIMER_SECONDS);
      setIsReset(false);
    }
  }, [isReset]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        clearInterval(timerId);
      };
    }, []),
  );

  return (
    <View className={'w-fit p-2 pr-6 self-start bg-primary-200 rounded'}>
      <TextStyled className={'text-[24px]'}>{formatTime(seconds)}</TextStyled>
    </View>
  );
};
