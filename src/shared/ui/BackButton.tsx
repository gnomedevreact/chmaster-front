import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/src/shared/ui/Button';
import { router } from 'expo-router';
import { cn } from '@/src/shared/lib/utils/cnUtils';

export const BackButton = ({
  customPress,
  className,
}: {
  customPress?: () => void;
  className?: string;
}) => {
  return (
    <Button
      className={cn('w-[50px] h-[50px] mb-3', className)}
      isLight={false}
      onPress={customPress ? () => customPress() : () => router.back()}
    >
      <Ionicons name="arrow-back" size={20} color="white" />
    </Button>
  );
};
