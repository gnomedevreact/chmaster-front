import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { useGetRandomPuzzles } from '@/src/shared/api/hooks/useGetRandomPuzzles';
import Chessboard, { ChessboardRef } from '@gnomedevreact/ch-private';
import { Square } from 'chess.js';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { ButtonCustom } from '@/src/shared/ui/ButtonCustom';

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

  const { puzzles } = useGetRandomPuzzles({ isTrainingStart });

  useEffect(() => {
    console.log(moves);
    if (moves) {
      chessboardRef?.current?.move({
        from: moves[0].substring(0, 2) as Square,
        to: moves[1].substring(2) as Square,
      });
      setMoveEnabled(true);
    }
  }, [moves]);

  useEffect(() => {
    if (moves && currentMove.move) {
      console.log(currentMove.move, currentMove.order);
      if (currentMove.move !== moves[currentMove.order]) {
        chessboardRef?.current?.undo();
        setCurrentMove({ order: currentMove.order, move: null });
      } else {
        setCurrentMove({ order: currentMove.order + 1, move: null });
      }
    }
  }, [currentMove, moves]);

  useEffect(() => {
    if (puzzles) {
      setMoves(puzzles[currentPuzzle].moves.split(' '));
      setCurrentMove({ order: 0, move: null });
      chessboardRef?.current?.resetBoard(puzzles[currentPuzzle].fen);
    }
  }, [puzzles, currentPuzzle]);

  // if (!puzzles || !moves) return null;

  return (
    <View className={'flex-1 py-4'}>
      <View className={'px-4'}>
        <TextStyled className={'text-[28px]'}>Start training</TextStyled>
      </View>
      <View className={'flex-1 justify-center'}>
        <View style={{ minHeight: width, minWidth: width }}>
          <Chessboard
            gestureEnabled={true}
            fen={puzzles ? puzzles[currentPuzzle].fen : undefined}
            ref={chessboardRef}
            colors={{ black: '#b58863', white: '#f0d9b5' }}
            onMove={({ state, move }) => {
              const formattedMove = move.from + move.to;
              setCurrentMove({ order: currentMove.order, move: formattedMove });

              console.log('move', move);
              console.log('state', state);
            }}
          />
        </View>
      </View>
      <View className={'px-4'}>
        <ButtonCustom
          text={'Let’s get started'}
          padding={10}
          isLight
          onPress={() => setIsTrainingStart(true)}
        />
      </View>
      {/*<View>*/}
      {/*  <Button*/}
      {/*    title={'Reset board'}*/}
      {/*    onPress={() => chessboardRef.current?.resetBoard()}*/}
      {/*  />*/}
      {/*  <Button title={'Undo'} onPress={() => chessboardRef.current?.undo()} />*/}
      {/*  <Button*/}
      {/*    title={'Next'}*/}
      {/*    onPress={() => {*/}
      {/*      setCurrentPuzzle((prevValue) => prevValue + 1);*/}
      {/*    }}*/}
      {/*  />*/}
      {/*  <Button*/}
      {/*    title={'FEN'}*/}
      {/*    onPress={() => {*/}
      {/*      chessboardRef?.current?.resetBoard(puzzles[currentPuzzle].fen);*/}
      {/*    }}*/}
      {/*  />*/}
      {/*  <Button*/}
      {/*    title={'Toggle move'}*/}
      {/*    onPress={() => {*/}
      {/*      setMoveEnabled(!moveEnabled);*/}
      {/*    }}*/}
      {/*  />*/}
      {/*</View>*/}
    </View>
  );
};
