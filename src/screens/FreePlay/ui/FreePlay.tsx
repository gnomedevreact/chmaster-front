import React, { useRef } from 'react';
import { Dimensions, View } from 'react-native';
import Chessboard, { ChessboardRef } from '@gnomedevreact/ch-private';

const width = Dimensions.get('window').width;

export const FreePlay = () => {
  const chessboardRef = useRef<ChessboardRef>(null);

  return (
    <View className={'py-4 flex-1'}>
      <View className={'flex-1 justify-center'}>
        <View style={{ minHeight: width, minWidth: width }}>
          <Chessboard
            ref={chessboardRef}
            fen={'7k/P7/8/8/8/8/7p/4K3 w - - 0 1'}
            colors={{ black: '#b58863', white: '#f0d9b5' }}
            durations={{ move: 90 }}
          />
        </View>
      </View>
    </View>
  );
};
