import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { TIMER_SECONDS } from '@/src/features/ChessGame/lib/consts';

interface TimerProps {
  isActive: boolean;
  setIsActive: (e: boolean) => void;
  isReset: boolean;
  setIsReset: (e: boolean) => void;
}

export const Timer = (props: TimerProps) => {
  const { setIsActive, isActive, isReset, setIsReset } = props;

  const [seconds, setSeconds] = useState(TIMER_SECONDS);
  const [timerId, setTimerId] = useState<NodeJS.Timeout>();

  useEffect(() => {
    if (seconds === 0) {
      setIsActive(false);
      clearInterval(timerId);
      setSeconds(TIMER_SECONDS);
      setIsReset(false);
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

  return (
    <View>
      <TextStyled>{formatTime(seconds)}</TextStyled>
    </View>
  );
};
