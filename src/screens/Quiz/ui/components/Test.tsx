import React, { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { questionsWhite, whiteResults } from '@/src/screens/Quiz/ui/lib/whiteTest';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { AntDesign, Feather } from '@expo/vector-icons';
import { cn } from '@/src/shared/lib/utils/cnUtils';
import { Button } from '@/src/shared/ui/Button';
import { useRouter } from 'expo-router';
import { blackResults, questionsBlack } from '@/src/screens/Quiz/ui/lib/blackTest';

const ChessOpeningQuiz = ({ isWhite }: { isWhite: boolean }) => {
  const results = useMemo(() => (isWhite ? whiteResults : blackResults), [isWhite]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(1);
  const [result, setResult] = useState<{ name: string; increase: number }>();
  const [currentIndex, setCurrentIndex] = useState<number>();

  const { push } = useRouter();

  const handleAnswer = (next: number | 'result', resultKey: keyof typeof results) => {
    if (next === 'result' && resultKey) {
      setResult(results[resultKey]);
    } else {
      setCurrentQuestion(next as number);
      setCurrentIndex(undefined);
    }
  };

  const question = useMemo(
    () =>
      isWhite
        ? questionsWhite.find((q) => q.id === currentQuestion)
        : questionsBlack.find((q) => q.id === currentQuestion),
    [currentQuestion],
  );

  if (result) {
    return (
      <View className={'flex flex-col gap-2'}>
        <TextStyled className={'text-[28px]'}>
          We think best opening for you is:
        </TextStyled>
        <TextStyled
          className={'text-[28px] text-primary-100 mb-10'}
          fontFamilyName={'NunitoSansBold'}
        >
          {result.name}
        </TextStyled>
        <TextStyled className={'text-lg text-primary-600'}>
          We expect your rating to increase by
          <TextStyled className={'text-[20px]'}>{` ${result.increase}% `}</TextStyled>
          after you start using this opening
        </TextStyled>
        <View className={'mt-10'}>
          <TextStyled className={'text-lg text-primary-600 mb-2'}>
            Check tutorials section
          </TextStyled>
          <Pressable
            className={
              'flex-row items-center justify-between max-h-[69px] flex flex-1 gap-[6px] p-3 bg-primary-200 rounded-[14px] mb-6'
            }
            onPress={() => push('/videos')}
          >
            <View className={'flex flex-row items-center gap-2'}>
              <TextStyled fontFamilyName={'NunitoSansBold'} className={'text-[22px]'}>
                Useful tutorials
              </TextStyled>
            </View>
            <View className={'p-3 bg-primary-100 rounded-[14px]'}>
              <Feather name="external-link" size={24} color="white" />
            </View>
          </Pressable>
          <TextStyled className={'text-lg text-primary-600 mb-2'}>
            Train opening in free play
          </TextStyled>
          <Pressable
            className={
              'flex-row items-center justify-between max-h-[69px] flex flex-1 gap-[6px] p-3 bg-primary-200 rounded-[14px]'
            }
            onPress={() => push('/(tabs)/freeplay')}
          >
            <View className={'flex flex-row items-center gap-2'}>
              <TextStyled fontFamilyName={'NunitoSansBold'} className={'text-[24px]'}>
                Free play
              </TextStyled>
            </View>
            <View className={'p-3 bg-primary-100 rounded-[14px]'}>
              <Feather name="external-link" size={24} color="white" />
            </View>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className={'flex-1 pb-10'}>
      {question && (
        <View className={'flex flex-col gap-8'}>
          <TextStyled className={'text-[24px]'}>{question.text}</TextStyled>
          <View className={'flex flex-col gap-4'}>
            {question.options.map((option, index) => (
              <Pressable
                className={'flex flex-row gap-4'}
                onPress={() => {
                  setCurrentIndex(index);
                }}
                key={index}
              >
                <View
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full border border-primary-100',
                    {
                      'bg-primary-100': currentIndex === index,
                    },
                  )}
                >
                  {currentIndex === index && (
                    <AntDesign name="check" size={16} color="white" />
                  )}
                </View>
                <TextStyled className={'text-primary-600'}>{option.label}</TextStyled>
              </Pressable>
            ))}
          </View>
        </View>
      )}
      <Button
        className={'mt-auto'}
        onPress={() => {
          if (currentIndex !== undefined) {
            handleAnswer(
              question?.options[currentIndex].next!,
              question?.options[currentIndex].result as keyof typeof results,
            );
          }
        }}
        disabled={currentIndex === undefined}
      >
        <TextStyled className={'text-lg'}>Confirm</TextStyled>
      </Button>
    </View>
  );
};
export default ChessOpeningQuiz;
