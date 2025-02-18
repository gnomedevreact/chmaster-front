import React, { useCallback, useRef, useState } from 'react';
import { Dimensions, Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import Chessboard, { ChessboardRef } from '@gnomedevreact/ch-private';
import { EvaluationBar } from '@/src/features/EvaluationBar/ui/EvaluationBar';
import { Move, Square } from 'chess.js';
import * as Haptics from 'expo-haptics';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { Button } from '@/src/shared/ui/Button';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { Input } from '@/src/shared/ui/Input';
import { useForm } from 'react-hook-form';
import { validateFen } from '@/src/shared/lib/utils/validateFen';
import { useEvaluateFen } from '@/src/features/EvaluationBar/api/hooks/useEvaluateFen';
import { presentPaywallIfNeeded } from '@/src/shared/lib/utils/presentPaywall';

const width = Dimensions.get('window').width;

export const FreePlay = () => {
  const { control, handleSubmit, reset } = useForm<{ fen: string }>({
    reValidateMode: 'onBlur',
  });
  const [isReset, setIsReset] = useState(false);
  const [lastMove, setLastMove] = useState<
    { from: Square; to: Square; color: 'w' | 'b' }[]
  >([]);
  const [currMove, setCurrMove] = useState(0);
  const [playerColor, setPlayerColor] = useState<'w' | 'b'>('w');
  const chessboardRef = useRef<ChessboardRef>(null);

  const { evaluateFen, evaluation, isPending, resetData } = useEvaluateFen();

  const applyFen = ({ fen }: { fen: string }) => {
    if (validateFen(fen)) {
      chessboardRef?.current?.resetBoard(fen);
      reset({ fen: '' });
    }
  };

  const handleEvaluate = async () => {
    const isSubscribed = await presentPaywallIfNeeded();

    if (isSubscribed) {
      evaluateFen(chessboardRef.current?.getState().fen!);
    }
  };

  const handleMove = useCallback((move: Move) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setPlayerColor(move.color === 'w' ? 'b' : 'w');
    setCurrMove((prev) => prev + 1);
    setLastMove((prev) =>
      prev.some((el) => el.from === move.from && el.to === move.to)
        ? [...prev]
        : [...prev, { from: move.from, to: move.to, color: move.color }],
    );
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
      <View className={'py-4 flex-1'}>
        <View className={'flex-1 justify-center'}>
          <View className={'flex flex-row items-end gap-5 px-4 mb-4'}>
            <Input
              control={control}
              label={'FEN'}
              name={'fen'}
              wrapClassname={'flex-1'}
              multiline={true}
            />
            <Button className={'w-[58px]'} onPress={handleSubmit(applyFen)}>
              <AntDesign name="rightcircle" size={24} color="white" />
            </Button>
          </View>
          <EvaluationBar
            evaluation={evaluation}
            color={playerColor}
            isReset={isReset}
            setIsReset={setIsReset}
          />
          <View style={{ minHeight: width, minWidth: width }} className={'items-center'}>
            <Chessboard
              onMove={({ state, move }) => handleMove(move)}
              ref={chessboardRef}
              colors={{ black: '#b58863', white: '#f0d9b5' }}
              durations={{ move: 120 }}
            />
          </View>
          <View className={'flex flex-col gap-2 px-4 mt-2'}>
            <View className={'flex flex-row gap-2'}>
              <Button
                onPress={() => {
                  chessboardRef?.current?.undo();
                  if (currMove > 0) {
                    setPlayerColor((prev) => (prev === 'w' ? 'b' : 'w'));
                    setCurrMove((prev) => prev - 1);
                  }
                }}
                className={'w-14'}
              >
                <Entypo name="chevron-left" size={24} color="white" />
              </Button>
              <Button
                onPress={() => {
                  chessboardRef?.current?.resetBoard();
                  setCurrMove(0);
                  setLastMove([]);
                  setIsReset(true);
                  resetData();
                }}
                isLight={false}
                className={'flex-1'}
              >
                <TextStyled className={'text-base'} fontFamilyName={'NunitoSansBold'}>
                  Reset
                </TextStyled>
              </Button>
              <Button
                onPress={() => {
                  if (lastMove[currMove]) {
                    setPlayerColor(lastMove[currMove].color);
                    chessboardRef?.current?.move({
                      from: lastMove[currMove].from,
                      to: lastMove[currMove].to,
                    });
                  }
                }}
                className={'w-14'}
              >
                <Entypo name="chevron-right" size={24} color="white" />
              </Button>
            </View>
            <Button
              onPress={handleEvaluate}
              isLoading={isPending}
              disabled={isPending || chessboardRef.current?.getState().game_over}
              isLight={false}
            >
              <TextStyled>
                {chessboardRef.current?.getState().game_over
                  ? 'Game over'
                  : 'Analyze position'}
              </TextStyled>
            </Button>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
