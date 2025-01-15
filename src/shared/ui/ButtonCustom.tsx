import React, { useState } from 'react';
import { Button } from 'react-native-paper';
import { TextStyled } from '@/src/shared/ui/TextStyled';

import { StyleSheet } from 'react-native';

interface ButtonCustomProps {
  text: string;
  loading?: boolean;
  mode?: 'text' | 'contained' | 'outlined' | 'elevated' | 'contained-tonal';
  isLight?: boolean;
  padding?: number;
}

export const ButtonCustom = (props: ButtonCustomProps) => {
  const { text, loading, mode, isLight, padding } = props;

  const [isPressed, setIsPressed] = useState(false);

  return (
    <Button
      mode={mode || 'contained'}
      loading={loading}
      buttonColor={isLight ? '#DA0C81' : '#272727'}
      contentStyle={{
        padding,
        borderWidth: 0,
        outline: 'none',
      }}
      textColor={'#FAFAFA'}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[styles.button, isPressed && styles.buttonPressed]}
    >
      <TextStyled className={'text-base font-medium'}>{text}</TextStyled>
    </Button>
  );
};

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
