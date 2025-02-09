import React, { useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { useGetTasks } from '@/src/shared/api/hooks/TasksHooks/useGetTasks';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { convertToRoman } from '@/src/shared/lib/utils/convertToRoman';
import { Foundation } from '@expo/vector-icons';
import { TaskStatusType, TaskType } from '@/src/shared/model/types/tasks.types';
import { cn } from '@/src/shared/lib/utils/cnUtils';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { TasksChessGame } from '@/src/features/TaskChessGame';
import { presentPaywallIfNeeded } from '@/src/shared/lib/utils/presentPaywall';

const TaskBlock = ({
  index,
  status,
  setActiveTask,
  isDisabled = false,
}: {
  index: number;
  status: TaskStatusType;
  setActiveTask?: () => void;
  isDisabled?: boolean;
}) => {
  const handlePress = async () => {
    const isSubscribed = await presentPaywallIfNeeded();

    if (isSubscribed) {
      setActiveTask!();
      return;
    }
  };

  return (
    <Pressable
      onPress={index === 9 ? handlePress : setActiveTask}
      className={cn(
        'relative flex flex-col items-center justify-center gap-1 w-[30%] h-[110px] p-2 bg-primary-200 rounded-md border border-transparent',
        {
          'border-primary-100': status === 'in_progress',
        },
      )}
      style={{
        shadowColor:
          status === 'completed'
            ? '#AAFF00'
            : status === 'locked'
              ? '#71797E'
              : '#DA0C81',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
      }}
      disabled={isDisabled}
    >
      <View
        className={
          'absolute flex items-center justify-center w-full h-full z-10 opacity-80'
        }
      >
        <View className={'-rotate-[5deg]'}>
          {status === 'completed' ? (
            <Foundation name="check" size={85} color="#4CBB17" />
          ) : status === 'locked' ? (
            <FontAwesome name="lock" size={70} color="#71797E" />
          ) : null}
        </View>
      </View>
      <TextStyled className={'text-[24px]'} fontFamilyName={'NunitoSansBold'}>
        {convertToRoman(index + 1)}
      </TextStyled>
      <TextStyled className={'text-base text-primary-300'}>day</TextStyled>
    </Pressable>
  );
};

export const TasksList = () => {
  const { allTasks, isLoadingTasks } = useGetTasks();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<TaskType>();
  const [activeIndex, setActiveIndex] = useState<number>();

  if (isLoadingTasks) return null;

  return (
    <View>
      <View className={'flex flex-row gap-4 justify-between flex-wrap'}>
        {allTasks?.tasks?.map((task, index) => {
          if (index > allTasks.current_task) {
            return (
              <TaskBlock index={index} key={index} status={'locked'} isDisabled={true} />
            );
          }

          return (
            <TaskBlock
              index={index}
              key={index}
              status={allTasks.current_task > index ? 'completed' : 'in_progress'}
              setActiveTask={() => {
                setActiveTask(task);
                setActiveIndex(index);
                setIsTaskModalOpen(true);
              }}
            />
          );
        })}
      </View>
      {isTaskModalOpen && activeTask && (
        <Modal visible={isTaskModalOpen} transparent={false} animationType={'slide'}>
          <TasksChessGame
            task={activeTask}
            taskStatus={
              allTasks!.current_task > activeIndex! ? 'completed' : 'in_progress'
            }
            closeModal={() => setIsTaskModalOpen(false)}
          />
        </Modal>
      )}
    </View>
  );
};
