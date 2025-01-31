import React, { ReactNode, useState } from 'react';
import { Pressable, PressableProps, StyleSheet } from 'react-native';
import { cn } from '@/src/shared/lib/utils/cnUtils';
import { ActivityIndicator } from 'react-native-paper';

interface ButtonProps extends PressableProps {
  children: ReactNode;
  className?: string;
  isLight?: boolean;
  onPress?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const Button = (props: ButtonProps) => {
  const { children, className, isLight = true, onPress, isLoading, disabled } = props;

  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={disabled ? undefined : () => setIsPressed(true)}
      onPressOut={disabled ? undefined : () => setIsPressed(false)}
      style={[styles.button, isPressed && styles.buttonPressed]}
      className={cn(
        'flex-row gap-2 items-center justify-center rounded-[14px] py-4',
        {
          'bg-primary-100': isLight,
          'bg-primary-200': !isLight,
        },
        className,
      )}
      disabled={disabled}
    >
      {isLoading && <ActivityIndicator color={'#FAFAFA'} />}
      {children}
    </Pressable>
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
