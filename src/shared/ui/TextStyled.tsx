import React from 'react';
import { Text } from 'react-native';
import { cn } from '@/src/shared/lib/utils/cnUtils';

interface StyledTextProps {
  children?: React.ReactNode;
  className?: string;
}

export const TextStyled = (props: StyledTextProps) => {
  const { children, className } = props;

  return (
    <Text
      style={{ fontFamily: 'NunitoSans' }}
      className={cn('text-[20px] font-medium', className)}
    >
      {children}
    </Text>
  );
};
