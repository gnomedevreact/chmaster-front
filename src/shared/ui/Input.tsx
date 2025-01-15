import React from 'react';
import { TextInput } from 'react-native-paper';
import { cn } from '@/src/shared/lib/utils/cnUtils';

interface InputProps {
  className?: string;
}

export const Input = (props: InputProps) => {
  const { className } = props;

  return <TextInput className={cn('', className)} />;
};
