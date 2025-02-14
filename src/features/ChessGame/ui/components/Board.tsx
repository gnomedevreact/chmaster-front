import React, { Dispatch, RefObject, SetStateAction, useCallback } from 'react';
import { Dimensions, View } from 'react-native';
import Chessboard, { ChessboardRef } from '@gnomedevreact/ch-private';
import * as Haptics from 'expo-haptics';
import { ActivityIndicator } from 'react-native-paper';
import { Move } from 'chess.js';
import { cn } from '@/src/shared/lib/utils/cnUtils';

const width = Dimensions.get('window').width;

interface BoardProps {
  moveEnabled: boolean;
  setMoveEnabled: (e: boolean) => void;
  chessboardRef: RefObject<ChessboardRef>;
  playerColor: 'b' | 'w' | undefined;
  setPlayerColor: (e: 'b' | 'w' | undefined) => void;
  isLoading: boolean;
  formatMove: (currMove: Move) => string;
  setCurrentMove: Dispatch<SetStateAction<{ order: number; move: string | null }>>;
}

export const Board = React.memo((props: BoardProps) => {
  const {
    moveEnabled,
    setMoveEnabled,
    chessboardRef,
    playerColor,
    setPlayerColor,
    isLoading,
    formatMove,
    setCurrentMove,
  } = props;

  const handleOnMove = useCallback(
    (move: Move) => {
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
    },
    [playerColor],
  );

  return (
    <View
      className={cn('relative', {
        'pointer-events-none': !moveEnabled,
      })}
    >
      <View className={'items-center'} style={{ minHeight: width, minWidth: width }}>
        <Chessboard
          ref={chessboardRef}
          gestureEnabled={moveEnabled}
          colors={{ black: '#b58863', white: '#f0d9b5' }}
          durations={{ move: 120 }}
          onMove={({ state, move }) => handleOnMove(move)}
        />
      </View>
      {isLoading && (
        <View
          className={
            'absolute top-0 flex items-center justify-center bg-primary-200 opacity-80 z-[99999]'
          }
          style={{
            width: width,
            height: Math.floor(width / 8) * 8,
          }}
        >
          <ActivityIndicator color={'#DA0C81'} size={'large'} />
        </View>
      )}
    </View>
  );
});
