import React, { useRef, useState } from 'react';
import { Dimensions, View } from 'react-native';
import Chessboard, { ChessboardRef } from '@gnomedevreact/ch-private';
import { EvaluationBar } from '@/src/features/EvaluationBar/ui/EvaluationBar';
import { ButtonCustom } from '@/src/shared/ui/ButtonCustom';
import { Square } from 'chess.js';
import * as Haptics from 'expo-haptics';

const width = Dimensions.get('window').width;

export const FreePlay = () => {
  const [isReset, setIsReset] = useState(false);
  const [lastMove, setLastMove] = useState<
    { from: Square; to: Square; color: 'w' | 'b' }[]
  >([]);
  const [currMove, setCurrMove] = useState(0);
  const [playerColor, setPlayerColor] = useState<'w' | 'b'>('w');
  const chessboardRef = useRef<ChessboardRef>(null);

  return (
    <View className={'py-4 flex-1'}>
      <View className={'flex-1 justify-center'}>
        <EvaluationBar
          chessBoardRef={chessboardRef}
          color={playerColor}
          isReset={isReset}
          setIsReset={setIsReset}
        />
        <View style={{ minHeight: width, minWidth: width }}>
          <Chessboard
            onMove={({ state, move }) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              setPlayerColor(move.color === 'w' ? 'b' : 'w');
              setCurrMove((prev) => prev + 1);
              setLastMove((prev) =>
                prev.some((el) => el.from === move.from && el.to === move.to)
                  ? [...prev]
                  : [...prev, { from: move.from, to: move.to, color: move.color }],
              );
            }}
            ref={chessboardRef}
            colors={{ black: '#b58863', white: '#f0d9b5' }}
            durations={{ move: 120 }}
          />
        </View>
        <View className={'flex flex-row gap-2 px-4'}>
          <ButtonCustom
            text={'Redo'}
            onPress={() => {
              if (lastMove[currMove]) {
                console.log(currMove, lastMove);
                setPlayerColor(lastMove[currMove].color);
                chessboardRef?.current?.move({
                  from: lastMove[currMove].from,
                  to: lastMove[currMove].to,
                });
              }
            }}
          />
          <ButtonCustom
            text={'Undo'}
            onPress={() => {
              console.log(lastMove);
              chessboardRef?.current?.undo();
              if (currMove > 0) {
                setPlayerColor(lastMove[currMove - 1].color);
              }
              setCurrMove((prev) => (prev > 0 ? prev - 1 : prev));
            }}
          />
          <ButtonCustom
            text={'Reset'}
            onPress={() => {
              chessboardRef?.current?.resetBoard();
              setCurrMove(0);
              setLastMove([]);
              setIsReset(true);
            }}
          />
        </View>
      </View>
    </View>
  );
};
