import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useGetRandomPuzzles } from '@/src/shared/api/hooks/useGetRandomPuzzles';
import { ChessboardRef } from '@gnomedevreact/ch-private';
import { Move, Square } from 'chess.js';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { Timer } from '@/src/widgets/Timer';
import { FabCustom } from '@/src/shared/ui/FabCustom';
import { Feather } from '@expo/vector-icons';
import { OptionsModal } from '@/src/features/ChessGame/ui/components/OptionsModal';
import { useQueryClient } from '@tanstack/react-query';
import { useFocusEffect } from 'expo-router';
import { StatsScreen } from '@/src/features/ChessGame/ui/components/StatsScreen';
import { Puzzle } from '@/src/shared/model/types/puzzles.types';
import { MIN_PUZZLES } from '@/src/features/ChessGame/lib/consts';
import { Badge } from '@/src/shared/ui/Badge';
import { Button } from '@/src/shared/ui/Button';
import { Board } from '@/src/features/ChessGame/ui/components/Board';

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
    setErrorCount((prevState) => prevState + 1);
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
          setCurrentPuzzleCopy((prevState) => prevState + 1);
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
      if (puzzles.length === currentPuzzle && lastInvalidated !== currentPuzzle) {
        queryClient.invalidateQueries({ queryKey: ['puzzles'] });
        setLastInvalidated(currentPuzzle);
        return;
      }

      if (puzzles[currentPuzzle]) {
        const localMoves = puzzles[currentPuzzle].moves.split(' ');
        setMoves(localMoves);
        setCurrentMove({ order: 0, move: 'auto' });
        setPlayerColor(undefined);
        chessboardRef?.current?.resetBoard(puzzles[currentPuzzle].fen);
      }
    }
  }, [puzzles, currentPuzzle, isTrainingStart]);

  const startTraining = useCallback(() => {
    setIsTrainingStart(true);
    setIsActiveTimer(true);
    setMoveEnabled(true);
  }, []);

  const stopTraining = useCallback(() => {
    setIsActiveTimer(false);
    setMoveEnabled(false);
  }, []);

  const resetTimer = useCallback(() => {
    setIsReset(true);
    resetGameState();
  }, []);

  const openSettings = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeGameStatsModal = useCallback(() => {
    setIsGameStats(false);
    setPuzzlesCopy([]);
    setErrorCount(0);
    setCurrentPuzzleCopy(0);
  }, []);

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
            puzzlesCopy={currentPuzzleCopy}
          />
        </View>
        {!isActiveTimer && (
          <FabCustom size={'medium'} onPress={openSettings}>
            <Feather name="settings" size={24} color="white" />
          </FabCustom>
        )}
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
        <Button onPress={isActiveTimer ? stopTraining : startTraining}>
          <TextStyled>{isActiveTimer ? 'Stop' : 'Start'}</TextStyled>
        </Button>
        {isActiveTimer && (
          <Button onPress={resetTimer} isLight={false}>
            <TextStyled className={'text-lg'}>Reset</TextStyled>
          </Button>
        )}
      </View>
      <OptionsModal modalVisible={isModalOpen} setModalVisible={setIsModalOpen} />
      <StatsScreen
        errors={errosCount}
        puzzles={puzzlesCopy}
        setErrors={setErrorCount}
        setIsStats={setIsGameStats}
        setPuzzlesCopy={setPuzzlesCopy}
        setCurrentPuzzleCopy={setCurrentPuzzleCopy}
        currentPuzzleCopy={currentPuzzleCopy}
        isGameStats={isGameStats}
        closeGameStatsModal={closeGameStatsModal}
      />
    </ScrollView>
  );
};
