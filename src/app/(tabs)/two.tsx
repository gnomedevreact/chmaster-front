import React, { useRef } from 'react';
import { Button, View } from 'react-native';

import Chessboard, { ChessboardRef } from 'react-native-chessboard';

const Two = () => {
  const chessboardRef = useRef<ChessboardRef>(null);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Chessboard
        ref={chessboardRef}
        fen={'2r2rk1/5ppp/bq2p3/p1ppP1N1/Pb1P2P1/1P2P2P/2QN4/2R1K2R b K - 1 18'}
        colors={{ black: '#b58863', white: '#f0d9b5' }}
        onMove={({ state, move }) => {
          console.log('move', move);
          console.log('state', state);
        }}
      />
      <Button title={'Reset board'} onPress={() => chessboardRef.current?.resetBoard()} />
    </View>
  );
};

export default Two;
