import React from 'react';
import { View } from 'react-native';
import { Puzzle } from '@/src/shared/model/types/puzzles.types';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { Container } from '@/src/widgets/Container';
import { ButtonCustom } from '@/src/shared/ui/ButtonCustom';
import { Badge } from '@/src/shared/ui/Badge';

interface StatsScreenProps {
  errors: number;
  puzzles: Puzzle[];
  setErrors: (e: number) => void;
  setIsStats: (e: boolean) => void;
  setPuzzlesCopy: (e: Puzzle[]) => void;
  setCurrentPuzzleCopy: (e: number) => void;
  currentPuzzleCopy: number;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function splitByCapitalLetters(input: string) {
  return input.replace(/([A-Z])/g, ' $1').trim();
}

function calculateAccuracy(total: number, errors: number) {
  const correct = total - errors;
  const accuracy = (correct / total) * 100;

  return accuracy < 0 ? 0 : Math.round(accuracy * 100) / 100;
}

function calculateExp(puzzles: Puzzle[]) {
  let totalExp = 0;

  puzzles.forEach((puzzle) => {
    const { rating, attempts, average_rating } = puzzle;
    const ratingWeight = rating / 1000;
    let puzzleExp = 10 * ratingWeight;
    const errorPenalty = 1 - average_rating / 100;
    puzzleExp *= 1 - errorPenalty;
    puzzleExp /= Math.sqrt(attempts);
    totalExp += Math.max(puzzleExp, 0);
  });

  return Math.round(totalExp);
}

const roundToNearest50 = (num: number) => Math.round(num / 50) * 50;
const calculateRecommendedRating = (
  puzzles: Puzzle[],
  totalSolved: number,
  totalErrors: number,
) => {
  const averagePuzzleRating =
    puzzles.reduce((sum, puzzle) => sum + puzzle.rating, 0) / puzzles.length;

  const errorPenalty = totalErrors / totalSolved;

  let recommendedRating = averagePuzzleRating * (1 - errorPenalty);

  recommendedRating = Math.max(Math.min(recommendedRating, 3200), 400);
  return roundToNearest50(recommendedRating);
};

export const StatsScreen = React.memo((props: StatsScreenProps) => {
  const {
    errors,
    setErrors,
    setIsStats,
    puzzles,
    setPuzzlesCopy,
    setCurrentPuzzleCopy,
    currentPuzzleCopy,
  } = props;

  const bestPuzzle = puzzles.sort((a, b) => b.rating - a.rating)[0];

  return (
    <Container className={'py-14 bg-primary-400'}>
      <View className={'flex flex-row items-center gap-3'}>
        <TextStyled className={'text-[26px] w-[120px]'}>Solved</TextStyled>
        <TextStyled
          className={'text-[42px] text-primary-100'}
          fontFamilyName={'NunitoSansBold'}
        >
          {currentPuzzleCopy}
        </TextStyled>
      </View>
      <View className={'flex flex-row items-center gap-3'}>
        <TextStyled className={'text-[26px] w-[120px]'}>Mistakes</TextStyled>
        <TextStyled
          className={'text-[42px] text-[#b20000]'}
          fontFamilyName={'NunitoSansBold'}
        >
          {errors}
        </TextStyled>
      </View>
      <View className={'flex flex-col gap-5 mt-5 mb-5'}>
        <View className={'flex flex-row gap-5'}>
          <Badge
            text1={`Accuracy`}
            text2={`${calculateAccuracy(puzzles.length, errors)}%`}
          />
          <Badge text1={`+${calculateExp(puzzles)}`} text2={'EXP'} />
        </View>
        <TextStyled className={'text-[28px]'}>Hardest solved puzzle</TextStyled>
        <View className={'flex flex-row flex-wrap gap-2'}>
          <Badge text1={`Rating`} text2={`${bestPuzzle.rating}`} />
          <Badge text1={`Popularity`} text2={`${bestPuzzle.popularity}%`} />
          <Badge
            text1={`Theme`}
            text2={`${capitalize(splitByCapitalLetters(bestPuzzle.themes.split(' ')[0]))}`}
          />
          <Badge text1={`Attempts`} text2={`${bestPuzzle.attempts}`} />
        </View>
        <View>
          <TextStyled>Recommended puzzle rating :</TextStyled>
          <View className={'flex flex-row items-center gap-3'}>
            <TextStyled>From</TextStyled>
            <TextStyled
              className={'text-primary-100 text-[28px]'}
              fontFamilyName={'NunitoSansBold'}
            >
              {calculateRecommendedRating(puzzles, puzzles.length, errors) - 200}
            </TextStyled>
            <TextStyled>To</TextStyled>
            <TextStyled
              className={'text-primary-100 text-[28px]'}
              fontFamilyName={'NunitoSansBold'}
            >
              {calculateRecommendedRating(puzzles, puzzles.length, errors)}
            </TextStyled>
          </View>
        </View>
      </View>
      <View className={'mt-auto'}>
        <ButtonCustom
          text={'Continue'}
          isLight
          padding={5}
          textClassName={'text-lg'}
          onPress={() => {
            setIsStats(false);
            setErrors(0);
            setPuzzlesCopy([]);
            setCurrentPuzzleCopy(0);
          }}
        />
      </View>
    </Container>
  );
});
