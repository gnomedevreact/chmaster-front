import React, { ReactNode, useState } from 'react';
import { Button } from 'react-native-paper';
import { TextStyled } from '@/src/shared/ui/TextStyled';

import { StyleSheet } from 'react-native';
import { cn } from '@/src/shared/lib/utils/cnUtils';

import * as Haptics from 'expo-haptics';

interface ButtonCustomProps {
  text: string;
  loading?: boolean;
  mode?: 'text' | 'contained' | 'outlined' | 'elevated' | 'contained-tonal';
  isLight?: boolean;
  padding?: number;
  onPress?: () => void;
  disabled?: boolean;
  textClassName?: string;
  btnStyle?: any;
  children?: ReactNode;
}

export const ButtonCustom = React.memo((props: ButtonCustomProps) => {
  const {
    text,
    loading,
    mode,
    isLight,
    padding,
    onPress,
    disabled,
    textClassName,
    btnStyle,
    children,
  } = props;

  const [isPressed, setIsPressed] = useState(false);

  return (
    <Button
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        if (onPress) {
          onPress();
        }
      }}
      mode={mode || 'contained'}
      loading={loading}
      disabled={disabled}
      buttonColor={isLight ? '#DA0C81' : '#272727'}
      contentStyle={{
        padding,
        borderWidth: 0,
        outline: 'none',
      }}
      textColor={'#FAFAFA'}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[styles.button, isPressed && styles.buttonPressed, btnStyle]}
    >
      {children}
      <TextStyled className={cn('text-base font-medium', textClassName)}>
        {text}
      </TextStyled>
    </Button>
  );
});

const styles = StyleSheet.create({
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderRadius: 14,
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }],
  },
});
