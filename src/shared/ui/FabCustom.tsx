import React, { ReactNode, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { cn } from '@/src/shared/lib/utils/cnUtils';

interface FabCustomProps {
  children: ReactNode;
  size?: 'small' | 'medium' | 'large';
  backgroundColor?: string;
  onPress?: () => void;
  className?: string;
}

export const FabCustom = (props: FabCustomProps) => {
  const { children, size = 'medium', className, onPress } = props;

  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      className={cn(
        'flex items-center justify-center rounded-2xl bg-primary-100',
        className,
        {
          'w-[86px] h-[86px]': size === 'large',
          'w-[56px] h-[56px]': size === 'medium',
        },
      )}
      style={[styles.button, isPressed && styles.buttonPressed]}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onPress}
    >
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
