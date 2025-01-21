import { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { cn } from '@/src/shared/lib/utils/cnUtils';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  scrollEnabled?: boolean;
}

export const Container = (props: ContainerProps) => {
  const { children, className, scrollEnabled = true } = props;

  return (
    <View className={'flex-1'}>
      <ScrollView
        alwaysBounceVertical={false}
        overScrollMode={'never'}
        scrollEnabled={scrollEnabled}
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <View className={cn('flex-1 px-4', className)}>{children}</View>
      </ScrollView>
    </View>
  );
};
