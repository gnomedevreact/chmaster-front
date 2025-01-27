import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { cn } from '@/src/shared/lib/utils/cnUtils';

interface InfoBlockProps {
  children: ReactNode;
  className?: string;
}

export const InfoBlock = (props: InfoBlockProps) => {
  const { children, className } = props;

  return (
    <View
      className={cn('flex flex-1 gap-[6px] p-3 bg-primary-200 rounded-[14px]', className)}
    >
      {children}
    </View>
  );
};
