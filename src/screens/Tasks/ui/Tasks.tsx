import React from 'react';
import { Container } from '@/src/widgets/Container';
import { TasksList } from '@/src/features/TasksList';

export const Tasks = () => {
  return (
    <Container className={'py-4'}>
      <TasksList />
    </Container>
  );
};
