import React, { useRef } from 'react';
import { Dimensions, View } from 'react-native';
import Chessboard, { ChessboardRef } from '@gnomedevreact/ch-private';
import { Move, Square } from 'chess.js';

const width = Dimensions.get('window').width;

export const FreePlay = () => {
  const chessboardRef = useRef<ChessboardRef>(null);

  const moves = ['a7a8q'];

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

  // useEffect(() => {
  //   makeMove(0);
  // }, []);

  return (
    <View className={'py-4 flex-1'}>
      <View className={'flex-1 justify-center'}>
        <View style={{ minHeight: width, minWidth: width }}>
          <Chessboard
            ref={chessboardRef}
            fen={'7k/P7/8/8/8/8/7p/4K3 w - - 0 1'}
            colors={{ black: '#b58863', white: '#f0d9b5' }}
            durations={{ move: 90 }}
            onMove={({ state, move }) => {
              // console.log(formatMove(move));
              // console.log('move', move);
              // console.log('state', state);
            }}
          />
        </View>
      </View>
    </View>
  );
};
