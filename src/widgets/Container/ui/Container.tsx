import { ReactNode } from 'react';
import { SafeAreaView, View } from 'react-native';
import { cn } from '@/src/shared/lib/utils/cnUtils';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export const Container = (props: ContainerProps) => {
  const { children, className } = props;

  return (
    <SafeAreaView className={'flex-1'}>
      <View className={cn('flex-1 px-4', className)}>{children}</View>
    </SafeAreaView>
  );
};
