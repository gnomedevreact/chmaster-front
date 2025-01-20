import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
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

  const [isGameStats, setIsGameStats] = useState(false);
  const [errosCount, setErrorCount] = useState(0);
  const [rightCount, setRightCount] = useState(0);

  const queryClient = useQueryClient();
  const { puzzles, resetPuzzles, isLoading } = useGetRandomPuzzles({ isTrainingStart });

  const resetGameState = () => {
    setIsTrainingStart(false);
    resetPuzzles();
    chessboardRef?.current?.resetBoard();
    setMoves(undefined);
    setMoveEnabled(false);
    setIsActiveTimer(false);
    setCurrentPuzzle(0);
  };

  const updateMoveEnabled = (enabled: boolean) => {
    setMoveEnabled(enabled);
  };

  function makeMove(index: number) {
    chessboardRef?.current?.move({
      from: moves![index].substring(0, 2) as Square,
      to: moves![index].substring(2) as Square,
    });
  }

  function formatMove(currMove: Move) {
    let move = currMove.from + currMove.to;

    if (currMove.promotion) {
      move += currMove.promotion;
    }

    return move;
  }

  useEffect(() => {
    if (moves && chessboardRef?.current) {
      console.log(moves);
      makeMove(0);
      setMoveEnabled(true);
    }
  }, [moves]);

  useEffect(() => {
    (async () => {
      if (moves && currentMove.move) {
        console.log(currentMove.move, currentMove.order);
        if (
          currentMove.move !== moves[currentMove.order] &&
          currentMove.order % 2 !== 0
        ) {
          chessboardRef?.current?.highlight({
            square: currentMove.move.substring(2, 4) as Square,
            color: '#da8f7f',
          });

          await sleep(2000);

          chessboardRef?.current?.undo();
          setCurrentMove({ order: currentMove.order, move: null });
          updateMoveEnabled(true);
          return;
        }

        if (
          currentMove.order !== 0 &&
          currentMove.order % 2 !== 0 &&
          currentMove.order < moves.length - 1
        ) {
          const nextOrder = currentMove.order + 1;
          setCurrentMove((prevState) => ({
            order: nextOrder,
            move: null,
          }));

          makeMove(nextOrder);
          updateMoveEnabled(true);
          return;
        }

        setCurrentMove({ order: currentMove.order + 1, move: null });

        if (currentMove.order >= moves.length - 1) {
          setCurrentPuzzle((prevState) => prevState + 1);
        }
      }
    })();
  }, [currentMove, moves]);

  useEffect(() => {
    if (puzzles.length > 0 && isTrainingStart) {
      console.log(puzzles, currentPuzzle);
      if ((currentPuzzle + 1) % 2 === 0 && lastInvalidated !== currentPuzzle) {
        queryClient.invalidateQueries({ queryKey: ['puzzles'] });
        setLastInvalidated(currentPuzzle);
      }

      if (currentPuzzle === 0 || currentPuzzle !== lastInvalidated) {
        if (currentPuzzle <= puzzles.length) {
          setMoves(puzzles[currentPuzzle].moves.split(' '));
          setCurrentMove({ order: 0, move: null });
          chessboardRef?.current?.resetBoard(puzzles[currentPuzzle].fen);
        }
      }
    }
  }, [puzzles, currentPuzzle, isTrainingStart]);

  function startTraining() {
    setIsTrainingStart(true);
    setIsActiveTimer(true);
  }

  const stopTraining = () => {
    setIsActiveTimer(false);
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
      contentContainerStyle={{ flex: 1 }}
      alwaysBounceVertical={false}
      overScrollMode={'never'}
    >
      <View className={'flex flex-row justify-between px-4 mb-10'}>
        <View>
          <TextStyled className={'text-[28px]'}>Start training</TextStyled>
          <Timer
            isActive={isActiveTimer}
            setIsActive={setIsActiveTimer}
            isReset={isReset}
            setIsReset={setIsReset}
            resetGameState={resetGameState}
          />
        </View>
        {!isActiveTimer && (
          <FabCustom size={'medium'} onPress={() => setIsModalOpen(true)}>
            <Feather name="settings" size={24} color="white" />
          </FabCustom>
        )}
      </View>
      <View className={'justify-center'}>
        <View style={{ minHeight: width, minWidth: width }}>
          <Chessboard
            gestureEnabled={moveEnabled}
            fen={puzzles.length > 0 ? puzzles[0].fen : undefined}
            ref={chessboardRef}
            colors={{ black: '#b58863', white: '#f0d9b5' }}
            durations={{ move: 90 }}
            onMove={({ state, move }) => {
              if ((currentMove.order + 1) % 2 === 0) {
                updateMoveEnabled(false);
              }
              const formattedMove = formatMove(move);
              setCurrentMove((prevState) => {
                return { order: prevState.order, move: formattedMove };
              });
            }}
          />
        </View>
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
    </ScrollView>
  );
};
