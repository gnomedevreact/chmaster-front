import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/src/shared/ui/Button';
import { router } from 'expo-router';

export const BackButton = () => {
  return (
    <Button
      className={'w-[50px] h-[50px] mb-3'}
      isLight={false}
      onPress={() => router.back()}
    >
      <Ionicons name="arrow-back" size={20} color="white" />
    </Button>
  );
};
