import React, { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { MIN_PUZZLES, TIMER_SECONDS } from '@/src/features/ChessGame/lib/consts';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { storage } from '@/src/core/lib/store/storage';

interface TimerProps {
  isActive: boolean;
  setIsActive: (e: boolean) => void;
  isReset: boolean;
  setIsReset: (e: boolean) => void;
  resetGameState: () => void;
  setIsStats: (e: boolean) => void;
  puzzlesCopy: number;
  isLoading: boolean;
}

export const Timer = React.memo((props: TimerProps) => {
  const {
    setIsActive,
    isActive,
    isLoading,
    isReset,
    setIsReset,
    resetGameState,
    setIsStats,
    puzzlesCopy,
  } = props;
  const [seconds, setSeconds] = useState(storage.getNumber('timer') || TIMER_SECONDS);

  useEffect(() => {
    if (isActive && !isLoading) {
      storage.set('timer', seconds);
      const interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 1) {
            clearInterval(interval);
            if (puzzlesCopy >= MIN_PUZZLES) {
              setIsStats(true);
            }
            setSeconds(storage.getNumber('timer') || TIMER_SECONDS);
            setIsReset(false);
            resetGameState();
            return storage.getNumber('timer') || TIMER_SECONDS;
          }
          return prevSeconds - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isActive, isLoading]);

  useEffect(() => {
    if (isReset) {
      setIsActive(false);
      setSeconds(storage.getNumber('timer') || TIMER_SECONDS);
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
