import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, Modal, ScrollView, View } from 'react-native';
import { useGetRandomPuzzles } from '@/src/shared/api/hooks/useGetRandomPuzzles';
import Chessboard, { ChessboardRef } from '@gnomedevreact/ch-private';
import { Move, Square } from 'chess.js';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { Timer } from '@/src/widgets/Timer';
import { FabCustom } from '@/src/shared/ui/FabCustom';
import { Feather } from '@expo/vector-icons';
import { OptionsModal } from '@/src/features/ChessGame/ui/components/OptionsModal';
import { useQueryClient } from '@tanstack/react-query';
import { useFocusEffect } from 'expo-router';
import { ButtonCustom } from '@/src/shared/ui/ButtonCustom';
import { cn } from '@/src/shared/lib/utils/cnUtils';
import { StatsScreen } from '@/src/features/ChessGame/ui/components/StatsScreen';
import { Puzzle } from '@/src/shared/model/types/puzzles.types';
import { ActivityIndicator } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { MIN_PUZZLES } from '@/src/features/ChessGame/lib/consts';
import { Badge } from '@/src/shared/ui/Badge';

const width = Dimensions.get('window').width;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const ChessGame = () => {
  const [isTrainingStart, setIsTrainingStart] = useState(false);
  const chessboardRef = useRef<ChessboardRef>(null);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [currentMove, setCurrentMove] = useState<{ order: number; move: null | string }>({
    order: 0,
    move: null,
  });
  const [moves, setMoves] = useState<string[]>();
  const [moveEnabled, setMoveEnabled] = useState<boolean>(false);

  const [isActiveTimer, setIsActiveTimer] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [lastInvalidated, setLastInvalidated] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playerColor, setPlayerColor] = useState<'w' | 'b'>();

  const [isGameStats, setIsGameStats] = useState(false);
  const [errosCount, setErrorCount] = useState(0);
  const [puzzlesCopy, setPuzzlesCopy] = useState<Puzzle[]>([]);
  const [currentPuzzleCopy, setCurrentPuzzleCopy] = useState(0);

  const resetGameStateLocal = () => {
    setIsTrainingStart(false);
    setMoves(undefined);
    setMoveEnabled(false);
    setIsActiveTimer(false);
    setCurrentPuzzle(0);
    setIsReset(true);
    setPlayerColor(undefined);
    setLastInvalidated(null);
    chessboardRef?.current?.resetBoard();

    if (puzzlesCopy.length < MIN_PUZZLES) {
      setPuzzlesCopy([]);
      setErrorCount(0);
      setCurrentPuzzleCopy(0);
    }
  };

  const queryClient = useQueryClient();
  const { puzzles, resetPuzzles, isLoading } = useGetRandomPuzzles({
    isTrainingStart,
    setPuzzlesCopy,
    resetGameStateLocal,
  });

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

  const formatMove = (currMove: Move) => {
    let move = currMove.from + currMove.to;
    if (currMove.promotion) {
      move += currMove.promotion;
    }
    return move;
  };

  useEffect(() => {
    if (moves && chessboardRef?.current) {
      makeMove(0);
      setMoveEnabled(true);
    }
  }, [moves]);

  const handleErrorMove = useCallback(async () => {
    setErrorCount((prevState) => prevState + 1);
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
        setCurrentPuzzleCopy((prevState) => prevState + 1);
      }
    }
  }, [moves, currentMove.order]);

  useEffect(() => {
    if (!moves || !currentMove.move) return;

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
  }, [currentMove, moves]);

  useEffect(() => {
    console.count('rerender');
    if (puzzles.length > 0 && isTrainingStart) {
      if (puzzles.length === currentPuzzle && lastInvalidated !== currentPuzzle) {
        queryClient.invalidateQueries({ queryKey: ['puzzles'] });
        setLastInvalidated(currentPuzzle);
        return;
      }

      if (puzzles[currentPuzzle]) {
        setMoves(puzzles[currentPuzzle].moves.split(' '));
        setCurrentMove({ order: 0, move: null });
        setPlayerColor(undefined);
        chessboardRef?.current?.resetBoard(puzzles[currentPuzzle].fen);
      }
    }
  }, [puzzles, currentPuzzle, isTrainingStart]);

  const startTraining = () => {
    setIsTrainingStart(true);
    setIsActiveTimer(true);
    setMoveEnabled(true);
  };

  const stopTraining = () => {
    setIsActiveTimer(false);
    setMoveEnabled(false);
  };

  const resetTimer = () => {
    setIsReset(true);
    resetGameState();
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        resetGameState();
      };
    }, []),
  );

  return (
    <ScrollView
      className={'py-4'}
      contentContainerStyle={{ flexGrow: 1 }}
      alwaysBounceVertical={false}
      overScrollMode={'never'}
      removeClippedSubviews
    >
      <View className={'flex flex-row justify-between px-4 mb-10'}>
        <View>
          <View className={'w-full flex flex-row items-center justify-between mb-2'}>
            <TextStyled className={'text-[28px]'}>Start training</TextStyled>
            {isTrainingStart && puzzles[currentPuzzle] && isActiveTimer ? (
              <View className={'self-end'}>
                <Badge text1={'Rating'} text2={`${puzzles[currentPuzzle]?.rating}`} />
              </View>
            ) : null}
          </View>
          <Timer
            isActive={isActiveTimer}
            setIsActive={setIsActiveTimer}
            isReset={isReset}
            setIsReset={setIsReset}
            resetGameState={resetGameState}
            setIsStats={setIsGameStats}
            puzzlesCopy={puzzlesCopy}
          />
        </View>
        {!isActiveTimer && (
          <FabCustom size={'medium'} onPress={() => setIsModalOpen(true)}>
            <Feather name="settings" size={24} color="white" />
          </FabCustom>
        )}
      </View>
      <View
        className={cn('justify-center items-center relative', {
          'pointer-events-none': !moveEnabled,
        })}
      >
        <View className={'items-center'} style={{ minHeight: width, minWidth: width }}>
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
        <ButtonCustom
          text={isActiveTimer ? 'Stop' : 'Start'}
          onPress={isActiveTimer ? stopTraining : startTraining}
          isLight
        />
        {isActiveTimer && <ButtonCustom text={'Reset'} onPress={resetTimer} />}
      </View>
      <OptionsModal modalVisible={isModalOpen} setModalVisible={setIsModalOpen} />
      {isGameStats && (
        <Modal
          visible={isGameStats}
          transparent={false}
          animationType={'slide'}
          onRequestClose={() => {
            setIsGameStats(false);
            setPuzzlesCopy([]);
            setErrorCount(0);
            setCurrentPuzzleCopy(0);
          }}
        >
          <StatsScreen
            errors={errosCount}
            puzzles={puzzlesCopy}
            setErrors={setErrorCount}
            setIsStats={setIsGameStats}
            setPuzzlesCopy={setPuzzlesCopy}
            setCurrentPuzzleCopy={setCurrentPuzzleCopy}
            currentPuzzleCopy={currentPuzzleCopy}
          />
        </Modal>
      )}
    </ScrollView>
  );
};
