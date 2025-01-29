import { ReactNode, useCallback, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { cn } from '@/src/shared/lib/utils/cnUtils';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  scrollEnabled?: boolean;
  isRefresh?: boolean;
  onRefreshAction?: () => void;
}

export const Container = (props: ContainerProps) => {
  const {
    children,
    className,
    scrollEnabled = true,
    isRefresh = false,
    onRefreshAction,
  } = props;

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (onRefreshAction) {
      onRefreshAction();
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View className={'flex-1'}>
      <ScrollView
        alwaysBounceVertical={false}
        overScrollMode={'never'}
        scrollEnabled={scrollEnabled}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        refreshControl={
          isRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
      >
        <View className={cn('flex-1 px-4', className)}>{children}</View>
      </ScrollView>
    </View>
  );
};
