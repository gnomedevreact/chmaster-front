import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { useGetRandomPuzzles } from '@/src/shared/api/hooks/useGetRandomPuzzles';
import Chessboard, { ChessboardRef } from '@gnomedevreact/ch-private';
import { Move, Square } from 'chess.js';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { Timer } from '@/src/widgets/Timer';
import { FabCustom } from '@/src/shared/ui/FabCustom';
import { Feather } from '@expo/vector-icons';
import { OptionsModal } from '@/src/features/ChessGame/ui/components/OptionsModal';
import { useQueryClient } from '@tanstack/react-query';

const width = Dimensions.get('window').width;

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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const { puzzles, resetPuzzles } = useGetRandomPuzzles({ isTrainingStart });

  const resetGameState = () => {
    setMoves(undefined);
    setMoveEnabled(false);
    setIsActiveTimer(false);
    setIsTrainingStart(false);
    resetPuzzles();
    chessboardRef?.current?.resetBoard();
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
    if (moves && currentMove.move) {
      console.log(currentMove.move, currentMove.order);
      if (
        currentMove.order !== 0 &&
        currentMove.order % 2 !== 0 &&
        currentMove.order < moves.length - 1
      ) {
        makeMove(currentMove.order + 1);
        setCurrentMove({ order: currentMove.order + 2, move: null });
        return;
      }

      if (currentMove.move !== moves[currentMove.order]) {
        chessboardRef?.current?.undo();
        setCurrentMove({ order: currentMove.order, move: null });
      } else {
        setCurrentMove({ order: currentMove.order + 1, move: null });

        if (currentMove.order >= moves.length - 1) {
          setCurrentPuzzle((prevState) => prevState + 1);
        }
      }
    }
  }, [currentMove, moves]);

  useEffect(() => {
    if (puzzles) {
      if (currentPuzzle === 5) {
        queryClient.invalidateQueries({ queryKey: ['puzzles'] });
      }
      setMoves(puzzles[currentPuzzle].moves.split(' '));
      setCurrentMove({ order: 0, move: null });
      console.log(puzzles[currentPuzzle].fen);
      chessboardRef?.current?.resetBoard(puzzles[currentPuzzle].fen);
    }
  }, [puzzles, currentPuzzle]);

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

  return (
    <View className={'py-4 flex-1'}>
      <View className={'px-4'}>
        <TextStyled className={'text-[28px]'}>Start training</TextStyled>
        <Timer
          isActive={isActiveTimer}
          setIsActive={setIsActiveTimer}
          isReset={isReset}
          setIsReset={setIsReset}
          resetGameState={resetGameState}
        />
      </View>
      <View className={'flex-1 justify-center'}>
        <View style={{ minHeight: width, minWidth: width }}>
          <Chessboard
            gestureEnabled={moveEnabled}
            fen={puzzles ? puzzles[0].fen : undefined}
            ref={chessboardRef}
            colors={{ black: '#b58863', white: '#f0d9b5' }}
            durations={{ move: 90 }}
            onMove={({ state, move }) => {
              const formattedMove = formatMove(move);
              setCurrentMove({ order: currentMove.order, move: formattedMove });

              console.log('move', move);
              console.log('state', state);
            }}
          />
        </View>
      </View>
      <View className={'px-4'}>
        {!isActiveTimer && (
          <FabCustom size={'large'} onPress={() => setIsModalOpen(true)}>
            <Feather name="settings" size={36} color="white" />
          </FabCustom>
        )}
        <View className={'flex flex-row items-center justify-start'}>
          <FabCustom
            size={'large'}
            className={'bg-[#11d526]'}
            onPress={isActiveTimer ? stopTraining : startTraining}
          >
            <TextStyled>{isActiveTimer ? 'Stop' : 'Start'}</TextStyled>
          </FabCustom>
          {isActiveTimer && (
            <FabCustom size={'large'} className={'bg-[#e60019]'} onPress={resetTimer}>
              <TextStyled>{'Reset'}</TextStyled>
            </FabCustom>
          )}
        </View>
      </View>
      <OptionsModal modalVisible={isModalOpen} setModalVisible={setIsModalOpen} />
    </View>
  );
};

{
  /*    onPress={() => chessboardRef.current?.resetBoard()}*/
}
{
  /*      chessboardRef?.current?.resetBoard(puzzles[currentPuzzle].fen);*/
}
{
  /*      setMoveEnabled(!moveEnabled);*/
}
