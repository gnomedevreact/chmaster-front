import React from 'react';
import { Text } from 'react-native';
import { cn } from '@/src/shared/lib/utils/cnUtils';

interface StyledTextProps {
  children?: React.ReactNode;
  className?: string;
  fontFamilyName?: 'NunitoSansBold' | string;
  fontSize?: number;
}

export const TextStyled = (props: StyledTextProps) => {
  const { children, className, fontFamilyName = 'NunitoSans' } = props;

  return (
    <Text
      style={{ fontFamily: fontFamilyName }}
      className={cn('text-[20px] font-medium text-primary-white', className)}
    >
      {children}
    </Text>
  );
};
