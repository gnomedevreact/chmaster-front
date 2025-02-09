import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, InteractionManager, ScrollView, View } from 'react-native';
import Chessboard, { ChessboardRef } from '@gnomedevreact/ch-private';
import { Move, Square } from 'chess.js';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { useQueryClient } from '@tanstack/react-query';
import { useFocusEffect } from 'expo-router';
import { cn } from '@/src/shared/lib/utils/cnUtils';
import { ActivityIndicator } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { TaskStatusType, TaskType } from '@/src/shared/model/types/tasks.types';
import { useGetPuzzlesByTheme } from '@/src/shared/api/hooks/PuzzlesHooks/useGetPuzzlesByTask';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/src/shared/ui/Button';

import ConfettiCannon from 'react-native-confetti-cannon';
import { PUZZLES_QUANTITY } from '@/src/features/TaskChessGame/lib/consts';
import { useCompleteTask } from '@/src/shared/api/hooks/TasksHooks/useCompleteTask';

const width = Dimensions.get('window').width;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

  const makeMove = useCallback(
    (index: number) => {
      if (!chessboardRef.current || !moves) return;
      chessboardRef.current.move({
        from: moves[index].substring(0, 2) as Square,
        to: moves[index].substring(2) as Square,
      });
    },
    [moves],
  );

  const formatMove = useCallback((currMove: Move) => {
    let move = currMove.from + currMove.to;
    if (currMove.promotion) {
      move += currMove.promotion;
    }
    return move;
  }, []);

  useEffect(() => {
    if (moves && chessboardRef?.current) {
      InteractionManager.runAfterInteractions(() => {
        makeMove(0);
        setMoveEnabled(true);
      });
    }
  }, [moves]);

  const handleErrorMove = useCallback(async () => {
    chessboardRef?.current?.highlight({
      square: currentMove?.move?.substring(2, 4) as Square,
      color: '#da8f7f',
    });

    await sleep(500);

    chessboardRef?.current?.undo();
    setCurrentMove({ order: currentMove.order, move: null });
    setMoveEnabled(true);
    return;
  }, [currentMove.move]);

  const handleAutoMove = useCallback(() => {
    const nextOrder = currentMove.order + 1;
    setCurrentMove((prevState) => ({
      order: nextOrder,
      move: null,
    }));

    makeMove(nextOrder);
    return;
  }, [currentMove.order, moves, makeMove]);

  const handlePlayerMove = useCallback(() => {
    if (moves) {
      setCurrentMove({ order: currentMove.order + 1, move: null });

      if (currentMove.order >= moves.length - 1) {
        setCurrentPuzzle((prevState) => prevState + 1);
      }
    }
  }, [moves, currentMove.order]);

  useEffect(() => {
    if (!moves || !currentMove.move) return;

    InteractionManager.runAfterInteractions(() => {
      if (
        currentMove.move !== moves[currentMove.order] &&
        currentMove.order % 2 !== 0 &&
        !chessboardRef.current?.getState().in_checkmate
      ) {
        handleErrorMove();
        return;
      }

      if (
        currentMove.order !== 0 &&
        currentMove.order % 2 !== 0 &&
        currentMove.order < moves.length - 1
      ) {
        handleAutoMove();
        return;
      }

      handlePlayerMove();
    });
  }, [currentMove, moves]);

  useEffect(() => {
    if (puzzles.length > 0 && isTrainingStart) {
      InteractionManager.runAfterInteractions(() => {
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
          setMoves(puzzles[currentPuzzle].moves.split(' '));
          setCurrentMove({ order: 0, move: null });
          setPlayerColor(undefined);
          chessboardRef?.current?.resetBoard(puzzles[currentPuzzle].fen);
          setHints(3);
        }
      });
    }
  }, [puzzles, currentPuzzle, isTrainingStart]);

  const startTraining = useCallback(() => {
    setIsTrainingStart(true);
    setMoveEnabled(true);
  }, []);

  const highLightNextMove = useCallback(() => {
    if (moves && hints > 0) {
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
          <View className={'py-4 flex-1'}>
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
            <View
              className={cn('justify-center items-center relative', {
                'pointer-events-none': !moveEnabled,
              })}
            >
              <View
                className={'items-center'}
                style={{ minHeight: width, minWidth: width }}
              >
                <Chessboard
                  gestureEnabled={moveEnabled}
                  fen={puzzles.length > 0 ? puzzles[0].fen : undefined}
                  ref={chessboardRef}
                  colors={{ black: '#b58863', white: '#f0d9b5' }}
                  durations={{ move: 120 }}
                  onMove={({ state, move }) => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                    if (playerColor && playerColor === move.color) {
                      setMoveEnabled(false);
                    } else {
                      setMoveEnabled(true);
                    }
                    if (!playerColor) {
                      setPlayerColor(move.color === 'w' ? 'b' : 'w');
                    }
                    const formattedMove = formatMove(move);
                    setCurrentMove((prevState) => {
                      return { order: prevState.order, move: formattedMove };
                    });
                  }}
                />
              </View>
              {isLoading && (
                <View
                  className={`absolute top-0 flex items-center justify-center bg-primary-200 opacity-80 z-[99999]`}
                  style={{
                    width: Math.floor(width / 8) * 8,
                    height: Math.floor(width / 8) * 8,
                  }}
                >
                  <ActivityIndicator color={'#DA0C81'} size={'large'} />
                </View>
              )}
            </View>
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
