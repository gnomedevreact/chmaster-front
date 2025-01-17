import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { useGetRandomPuzzles } from '@/src/shared/api/hooks/useGetRandomPuzzles';
import Chessboard, { ChessboardRef } from '@gnomedevreact/ch-private';
import { Square } from 'chess.js';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { Timer } from '@/src/widgets/Timer';
import { FabCustom } from '@/src/shared/ui/FabCustom';
import Slider from '@react-native-community/slider';

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

  const [rangeValues, setRangeValues] = useState([20]);

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

  function startTraining() {
    setIsTrainingStart(true);
  }

  const startTimer = () => {
    setIsActiveTimer(true);
  };

  const stopTimer = () => {
    setIsActiveTimer(false);
  };

  const resetTimer = () => {
    setIsReset(true);
  };

  const onRangeValuesChange = (values: number[]) => {
    setRangeValues(values);
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
        />
      </View>
      <View className={'flex-1 justify-center'}>
        <View style={{ minHeight: width, minWidth: width }}>
          <Chessboard
            gestureEnabled={true}
            fen={puzzles ? puzzles[currentPuzzle].fen : undefined}
            ref={chessboardRef}
            colors={{ black: '#b58863', white: '#f0d9b5' }}
            durations={{ move: 90 }}
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
        <Slider
        // values={rangeValues}
        // onValuesChange={onRangeValuesChange}
        // step={10}
        // markerStyle={{
        //   height: 20,
        //   width: 20,
        //   backgroundColor: '#3498db',
        // }}
        // selectedStyle={{
        //   backgroundColor: '#3498db',
        // }}
        // unselectedStyle={{
        //   backgroundColor: '#d3d3d3',
        // }}
        />
        <View className={'flex flex-col items-center justify-start'}>
          <FabCustom
            size={'large'}
            className={'bg-[#11d526]'}
            onPress={isActiveTimer ? stopTimer : startTimer}
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
