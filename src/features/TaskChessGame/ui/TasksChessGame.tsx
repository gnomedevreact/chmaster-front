import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { ChessboardRef } from '@gnomedevreact/ch-private';
import { Move, Square } from 'chess.js';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { useQueryClient } from '@tanstack/react-query';
import { useFocusEffect } from 'expo-router';
import { cn } from '@/src/shared/lib/utils/cnUtils';
import { TaskStatusType, TaskType } from '@/src/shared/model/types/tasks.types';
import { useGetPuzzlesByTheme } from '@/src/shared/api/hooks/PuzzlesHooks/useGetPuzzlesByTask';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/src/shared/ui/Button';

import ConfettiCannon from 'react-native-confetti-cannon';
import { PUZZLES_QUANTITY } from '@/src/features/TaskChessGame/lib/consts';
import { useCompleteTask } from '@/src/shared/api/hooks/TasksHooks/useCompleteTask';
import { Board } from '@/src/features/ChessGame/ui/components/Board';

export const TasksChessGame = ({
  task,
  closeModal,
  taskStatus,
}: {
  task: TaskType;
  closeModal: () => void;
  taskStatus: TaskStatusType;
}) => {
  const [isTrainingStart, setIsTrainingStart] = useState(false);
  const chessboardRef = useRef<ChessboardRef>(null);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [currentMove, setCurrentMove] = useState<{ order: number; move: null | string }>({
    order: 0,
    move: null,
  });
  const [moves, setMoves] = useState<string[]>();
  const [moveEnabled, setMoveEnabled] = useState<boolean>(false);

  const [lastInvalidated, setLastInvalidated] = useState<number | null>(null);
  const [playerColor, setPlayerColor] = useState<'w' | 'b'>();

  const [isConfetti, setIsConfetti] = useState<boolean>(false);
  const [hints, setHints] = useState(3);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const resetGameStateLocal = () => {
    setIsTrainingStart(false);
    setMoves(undefined);
    setMoveEnabled(false);
    setCurrentPuzzle(0);
    setPlayerColor(undefined);
    setLastInvalidated(null);
    chessboardRef?.current?.resetBoard();
  };

  const queryClient = useQueryClient();
  const { puzzles, resetPuzzles, isLoading } = useGetPuzzlesByTheme({
    isTrainingStart,
    resetGameStateLocal,
    task,
  });
  const { completeTask, isPendingCompletion, isComplete } = useCompleteTask();

  const resetGameState = () => {
    resetGameStateLocal();
    resetPuzzles();
  };

  const makeMove = useCallback((moves: string[] | undefined, index: number) => {
    if (!moves) return;
    chessboardRef?.current?.move({
      from: moves[index].substring(0, 2) as Square,
      to: moves[index].substring(2) as Square,
    });
  }, []);

  const formatMove = useCallback((currMove: Move) => {
    let move = currMove.from + currMove.to;
    if (currMove.promotion) {
      move += currMove.promotion;
    }
    return move;
  }, []);

  const handleErrorMove = useCallback(async (move: string) => {
    chessboardRef?.current?.highlight({
      square: move.substring(2, 4) as Square,
      color: '#da8f7f',
    });

    await sleep(500);

    chessboardRef?.current?.undo();
    setCurrentMove((prevState) => ({ order: prevState.order, move: null }));
    setMoveEnabled(true);
    return;
  }, []);

  const handleAutoMove = useCallback(
    (moves: string[], index: number) => {
      setCurrentMove((prevState) => ({
        order: index || prevState.order + 1,
        move: null,
      }));

      setTimeout(() => {
        makeMove(moves, index);
      }, 40);
      return;
    },
    [currentMove.order],
  );

  const handlePlayerMove = useCallback(
    (currentOrder: number) => {
      if (moves) {
        setCurrentMove((prevState) => ({ order: prevState.order + 1, move: null }));

        if (currentOrder >= moves.length - 1) {
          setCurrentPuzzle((prevState) => prevState + 1);
        }
      }
    },
    [moves],
  );

  useEffect(() => {
    if (!moves || !currentMove.move) return;

    if (currentMove.order === 0 && currentMove.move === 'auto') {
      makeMove(moves, 0);
      return;
    }

    if (
      currentMove.move !== moves[currentMove.order] &&
      currentMove.order % 2 !== 0 &&
      !chessboardRef.current?.getState().in_checkmate
    ) {
      handleErrorMove(currentMove.move);
      return;
    }

    if (
      currentMove.order !== 0 &&
      currentMove.order % 2 !== 0 &&
      currentMove.order < moves.length - 1
    ) {
      handleAutoMove(moves, currentMove.order + 1);
      return;
    }

    handlePlayerMove(currentMove.order);
  }, [currentMove, moves]);

  useEffect(() => {
    if (puzzles.length > 0 && isTrainingStart) {
      if (currentPuzzle === PUZZLES_QUANTITY) {
        completeTask();
        setIsConfetti(true);
        resetGameState();
        return;
      }

      if (puzzles.length === currentPuzzle && lastInvalidated !== currentPuzzle) {
        queryClient.invalidateQueries({ queryKey: ['puzzles tasks', task.id] });
        setLastInvalidated(currentPuzzle);
        return;
      }

      if (puzzles[currentPuzzle]) {
        const localMoves = puzzles[currentPuzzle].moves.split(' ');
        setMoves(localMoves);
        setCurrentMove({ order: 0, move: 'auto' });
        setPlayerColor(undefined);
        setHints(3);
        chessboardRef?.current?.resetBoard(puzzles[currentPuzzle].fen);
      }
    }
  }, [puzzles, currentPuzzle, isTrainingStart]);

  const startTraining = useCallback(() => {
    setIsTrainingStart(true);
    setMoveEnabled(true);
  }, []);

  const highLightNextMove = useCallback(() => {
    if (
      moves &&
      hints > 0 &&
      chessboardRef.current &&
      (currentMove.order + 1) % 2 === 0
    ) {
      chessboardRef?.current?.highlight({
        square: moves[currentMove.order].substring(0, 2) as Square,
        color: '#50C87880',
      });
      chessboardRef?.current?.highlight({
        square: moves[currentMove.order].substring(2) as Square,
        color: '#50C87880',
      });
      setHints((prev) => prev - 1);
    }
  }, [moves, currentMove.order, hints]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        resetGameState();
      };
    }, []),
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView className={'flex-1 bg-[#0F0F0F]'}>
        <ScrollView
          className={'bg-primary-400'}
          contentContainerStyle={{ flexGrow: 1 }}
          alwaysBounceVertical={false}
          overScrollMode={'never'}
          removeClippedSubviews
        >
          <View className={'flex flex-col gap-5 py-4 flex-1'}>
            <View className={'flex flex-row justify-between px-4 mb-10'}>
              <View>
                <Button
                  className={'w-[50px] h-[50px] mb-3'}
                  onPress={closeModal}
                  isLight={false}
                >
                  <Ionicons name="arrow-back" size={20} color="white" />
                </Button>
                <View>
                  <TextStyled className={'text-[20px]'} fontFamilyName={'NunitoSansBold'}>
                    {task.name}
                  </TextStyled>
                </View>
                <TextStyled className={'text-[16px] text-primary-600'}>
                  {task.description}
                </TextStyled>
              </View>
            </View>
            <Board
              moveEnabled={moveEnabled}
              setMoveEnabled={setMoveEnabled}
              chessboardRef={chessboardRef}
              playerColor={playerColor}
              setPlayerColor={setPlayerColor}
              isLoading={isLoading}
              formatMove={formatMove}
              setCurrentMove={setCurrentMove}
            />
            <View className={'flex flex-col gap-3 px-4 mt-auto'}>
              {isTrainingStart && (
                <Button
                  className={cn('self-start p-4', {
                    'bg-[#4F7942]': hints > 0,
                    'bg-primary-500': hints <= 0,
                  })}
                  onPress={isTrainingStart ? highLightNextMove : undefined}
                >
                  <Ionicons name="bulb-sharp" size={24} color="white" />
                </Button>
              )}
              <Button
                onPress={
                  isPendingCompletion || isComplete || taskStatus === 'completed'
                    ? closeModal
                    : startTraining
                }
                disabled={isLoading || isTrainingStart || isPendingCompletion}
                isLoading={isPendingCompletion}
                className={cn({
                  'bg-[#4F7942]': taskStatus === 'completed' || isComplete,
                })}
              >
                <TextStyled className={'text-base'}>
                  {taskStatus === 'completed' || isComplete
                    ? 'Completed'
                    : isTrainingStart
                      ? `${currentPuzzle}/${PUZZLES_QUANTITY}`
                      : 'Start'}
                </TextStyled>
              </Button>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      {isConfetti && (
        <ConfettiCannon
          count={100}
          origin={{ x: 0, y: 0 }}
          fadeOut={true}
          colors={['#DA0C81', '#3C3C3C']}
          explosionSpeed={700}
          onAnimationEnd={() => setIsConfetti(false)}
        />
      )}
    </SafeAreaProvider>
  );
};
