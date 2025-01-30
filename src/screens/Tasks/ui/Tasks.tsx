import React from 'react';
import { View } from 'react-native';
import { useGetTasks } from '@/src/shared/api/hooks/TasksHooks/useGetTasks';

export const Tasks = () => {
  const { userTasks, tasks, isLoadingUserTasks, isLoadingTasks, error } = useGetTasks();

  console.log(tasks);
  console.log(userTasks);

  if (isLoadingTasks || isLoadingUserTasks || !userTasks) return null;

  return (
    <View className={'flex flex-row gap-3 flex-wrap'}>
      {tasks?.map((task, index) => {
        if (!userTasks[index]) {
          return <View className={'w-[30px] h-[30px] bg-primary-white'} />;
        }

        return <View className={'w-[30px] h-[30px] bg-primary-100'} />;
      })}
    </View>
  );
};
