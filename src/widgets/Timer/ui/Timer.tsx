import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { MIN_PUZZLES, TIMER_SECONDS } from '@/src/features/ChessGame/lib/consts';
import { useFocusEffect } from 'expo-router';
import { Puzzle } from '@/src/shared/model/types/puzzles.types';
import { AntDesign, Ionicons } from '@expo/vector-icons';

interface TimerProps {
  isActive: boolean;
  setIsActive: (e: boolean) => void;
  isReset: boolean;
  setIsReset: (e: boolean) => void;
  resetGameState: () => void;
  setIsStats: (e: boolean) => void;
  puzzlesCopy: Puzzle[];
}

export const Timer = React.memo((props: TimerProps) => {
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
      if (puzzlesCopy.length >= MIN_PUZZLES) {
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

  const intervalRefPlus = useRef<NodeJS.Timeout | null>(null);
  const intervalRefMinus = useRef<NodeJS.Timeout | null>(null);

  const handlePressInPlus = () => {
    if (!intervalRefPlus.current) {
      intervalRefPlus.current = setInterval(() => {
        setSeconds((prev) => (prev <= 1180 ? prev + 20 : prev));
      }, 120);
    }
  };
  const handlePressInMinus = () => {
    if (!intervalRefMinus.current) {
      intervalRefMinus.current = setInterval(() => {
        setSeconds((prev) => (prev >= 80 ? prev - 20 : prev));
      }, 120);
    }
  };

  const handlePressOutPlus = () => {
    if (intervalRefPlus.current) {
      clearInterval(intervalRefPlus.current);
      intervalRefPlus.current = null;
    }
  };
  const handlePressOutMinus = () => {
    if (intervalRefMinus.current) {
      clearInterval(intervalRefMinus.current);
      intervalRefMinus.current = null;
    }
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        clearInterval(timerId);
      };
    }, []),
  );

  return (
    <View className={'flex flex-row items-center gap-2'}>
      <View
        className={
          'flex flex-row items-center gap-5 justify-between p-2 self-start bg-primary-200 rounded'
        }
      >
        <Ionicons name="timer-outline" size={24} color="white" />
        <TextStyled className={'text-[24px]'}>{formatTime(seconds)}</TextStyled>
      </View>
      {!isActive && (
        <View className={'flex flex-row gap-4'}>
          <Pressable onPressIn={handlePressInMinus} onPressOut={handlePressOutMinus}>
            <AntDesign name="minuscircleo" size={32} color="white" />
          </Pressable>
          <Pressable onPressIn={handlePressInPlus} onPressOut={handlePressOutPlus}>
            <AntDesign name="pluscircleo" size={32} color="white" />
          </Pressable>
        </View>
      )}
    </View>
  );
});
