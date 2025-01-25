import React, { RefObject, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useEvaluateFen } from '@/src/features/EvaluationBar/api/hooks/useEvaluateFen';
import { ButtonCustom } from '@/src/shared/ui/ButtonCustom';
import { ChessboardRef } from '@gnomedevreact/ch-private';
import { TextStyled } from '@/src/shared/ui/TextStyled';

export const EvaluationBar = ({
  chessBoardRef,
  color,
  isReset,
  setIsReset,
}: {
  chessBoardRef: RefObject<ChessboardRef>;
  color: 'w' | 'b';
  isReset: boolean;
  setIsReset: (e: boolean) => void;
}) => {
  const [playerColor, setPlayerColor] = useState<'w' | 'b'>('b');
  const [winningPercentage, setWinningPercentage] = useState(50);

  const { evaluateFen, evaluation, isPending, resetData } = useEvaluateFen();

  const normalizeStockfishEvaluation = (score: number, min = -1000, max = 1000) => {
    const normalizedPercentage = ((score - min) / (max - min)) * 100;

    return Math.min(100, Math.max(0, normalizedPercentage));
  };

  function centipawnsToPawnUnits(cp: number): number {
    return Math.round((cp / 100) * 10) / 10;
  }

  const updateEvaluationBar = (score: number) => {
    console.log(score);

    const normalizedPercentage = normalizeStockfishEvaluation(score);

    console.log(normalizedPercentage);
    setWinningPercentage(Math.floor(normalizedPercentage));
  };

  useEffect(() => {
    const score = evaluation?.data.evaluation;
    if (score) {
      setPlayerColor(color);
      updateEvaluationBar(score);
    }
  }, [evaluation]);

  useEffect(() => {
    if (isReset) {
      resetData();
      setWinningPercentage(50);
      setPlayerColor('w');
      setIsReset(false);
    }
  }, [isReset]);

  return (
    <View className={'flex flex-col gap-2 p-4'}>
      <View className={'w-full h-[30px] flex flex-row items-center'}>
        <View
          style={{
            width:
              playerColor === 'w'
                ? `${winningPercentage}%`
                : `${100 - winningPercentage}%`,
          }}
          className={'flex items-start justify-center h-full pl-2 bg-primary-white'}
        >
          {(evaluation && evaluation.data.evaluation > 0 && playerColor === 'w') ||
          (playerColor === 'b' && evaluation && evaluation.data.evaluation < 0) ? (
            <TextStyled
              className={'text-primary-[#403d39]'}
            >{`+${Math.abs(centipawnsToPawnUnits(evaluation?.data.evaluation))}`}</TextStyled>
          ) : null}
        </View>
        <View
          style={{
            width:
              playerColor === 'b'
                ? `${winningPercentage}%`
                : `${100 - winningPercentage}%`,
          }}
          className={'flex items-end justify-center h-full pr-2 bg-[#403d39]'}
        >
          {(evaluation && evaluation.data.evaluation > 0 && playerColor === 'b') ||
          (playerColor === 'w' && evaluation && evaluation.data.evaluation < 0) ? (
            <TextStyled
              className={'text-primary-white'}
            >{`-${Math.abs(centipawnsToPawnUnits(evaluation?.data.evaluation))}`}</TextStyled>
          ) : null}
        </View>
      </View>
      <ButtonCustom
        text={
          chessBoardRef.current?.getState().game_over ? 'Game over' : 'Analyze position'
        }
        onPress={() => evaluateFen(chessBoardRef.current?.getState().fen!)}
        loading={isPending}
        disabled={isPending || chessBoardRef.current?.getState().game_over}
      />
    </View>
  );
};
