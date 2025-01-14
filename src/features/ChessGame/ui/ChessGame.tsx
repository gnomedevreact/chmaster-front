import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useGetRandomPuzzles } from '@/src/shared/api/hooks/useGetRandomPuzzles';
import Chessboard, { ChessboardRef } from '@gnomedevreact/ch-private';
import { Square } from 'chess.js';

export const ChessGame = () => {
  const chessboardRef = useRef<ChessboardRef>(null);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [currentMove, setCurrentMove] = useState<{ order: number; move: null | string }>({
    order: 0,
    move: null,
  });
  const [moves, setMoves] = useState<string[]>();
  const [moveEnabled, setMoveEnabled] = useState<boolean>(false);

  const { puzzles } = useGetRandomPuzzles();

  useEffect(() => {}, []);

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

  if (!puzzles || !moves) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.chessboardContainer}>
        <Chessboard
          gestureEnabled={moveEnabled}
          fen={puzzles[currentPuzzle].fen}
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
      <View style={styles.buttonsContainer}>
        {/*<Button*/}
        {/*  title={'Reset board'}*/}
        {/*  onPress={() => chessboardRef.current?.resetBoard()}*/}
        {/*/>*/}
        {/*<Button title={'Undo'} onPress={() => chessboardRef.current?.undo()} />*/}
        {/*<Button*/}
        {/*  title={'Next'}*/}
        {/*  onPress={() => {*/}
        {/*    setCurrentPuzzle((prevValue) => prevValue + 1);*/}
        {/*  }}*/}
        {/*/>*/}
        {/*<Button*/}
        {/*  title={'FEN'}*/}
        {/*  onPress={() => {*/}
        {/*    chessboardRef?.current?.resetBoard(puzzles[currentPuzzle].fen);*/}
        {/*  }}*/}
        {/*/>*/}
        {/*<Button*/}
        {/*  title={'Toggle move'}*/}
        {/*  onPress={() => {*/}
        {/*    setMoveEnabled(!moveEnabled);*/}
        {/*  }}*/}
        {/*/>*/}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chessboardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    padding: 16,
  },
});
