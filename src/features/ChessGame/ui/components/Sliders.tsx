import React, { useEffect } from 'react';
import Slider from '@react-native-community/slider';
import { View } from 'react-native';
import { Input } from '@/src/shared/ui/Input';
import { useForm } from 'react-hook-form';
import { storage } from '@/src/core/lib/store/storage';

interface FormProps {
  minRating: string;
  maxRating: string;
}

export const Sliders = ({
  maxSliderValue,
  minSliderValue,
  setMinSliderValue,
  setMaxSliderValue,
}: {
  minSliderValue: number;
  maxSliderValue: number;
  setMinSliderValue: (e: number) => void;
  setMaxSliderValue: (e: number) => void;
}) => {
  const { control, setValue, watch } = useForm<FormProps>({
    defaultValues: {
      minRating: String(minSliderValue),
      maxRating: String(maxSliderValue),
    },
    reValidateMode: 'onBlur',
  });

  useEffect(() => {
    const getValues = async () => {
      const min = storage.getString('minRating');
      const max = storage.getString('maxRating');

      const parsedMin = Math.max(Number(min) || 200, 200);
      const parsedMax = Math.min(Number(max) || 3400, 3400);

      setMinSliderValue(parsedMin);
      setMaxSliderValue(parsedMax);
      setValue('minRating', String(parsedMin));
      setValue('maxRating', String(parsedMax));
    };
    getValues();
  }, [setMinSliderValue, setMaxSliderValue, setValue]);

  const handleMinSliderChange = (value: number) => {
    const maxLimit = maxSliderValue - 300;
    const newValue = Math.max(200, Math.min(value, maxLimit));
    setMinSliderValue(newValue);
    setValue('minRating', String(newValue));
  };

  const handleMaxSliderChange = (value: number) => {
    const minLimit = minSliderValue + 300;
    const newValue = Math.min(3400, Math.max(value, minLimit));
    setMaxSliderValue(newValue);
    setValue('maxRating', String(newValue));
  };

  const handleMinInputBlur = () => {
    const inputValue = watch('minRating');
    let newValue: number;

    if (isNaN(Number(inputValue))) {
      newValue = 200;
    } else {
      newValue = Number(inputValue);
      if (newValue < 200) newValue = 200;
      if (newValue > 3000) newValue = 3000;
    }

    setValue('minRating', String(newValue));
    setMinSliderValue(newValue);
  };

  const handleMaxInputBlur = () => {
    const inputValue = watch('maxRating');
    let newValue: number;

    if (isNaN(Number(inputValue))) {
      newValue = 3400;
    } else {
      newValue = Number(inputValue);
      if (newValue < 500) newValue = 500;
      if (newValue > 3400) newValue = 3400;
    }

    setValue('maxRating', String(newValue));
    setMaxSliderValue(newValue);
  };

  return (
    <View className={'flex flex-col gap-2'}>
      <View>
        <Input
          label={'Min. Rating'}
          control={control}
          name={'minRating'}
          onBlur={handleMinInputBlur}
          keyboardType="numeric"
        />
        <Slider
          minimumTrackTintColor={'#DA0C81'}
          thumbTintColor={'#FAFAFA'}
          minimumValue={200}
          maximumValue={Math.max(200, maxSliderValue - 400)}
          step={50}
          value={minSliderValue}
          onValueChange={handleMinSliderChange}
        />
      </View>
      <View className={'mb-5'}>
        <Input
          label={'Max. Rating'}
          control={control}
          name={'maxRating'}
          onBlur={handleMaxInputBlur}
          keyboardType="numeric"
        />
        <Slider
          minimumTrackTintColor={'#DA0C81'}
          thumbTintColor={'#FAFAFA'}
          minimumValue={Math.min(3400, minSliderValue + 300)}
          maximumValue={3400}
          step={50}
          value={maxSliderValue}
          onValueChange={handleMaxSliderChange}
        />
      </View>
    </View>
  );
};
