import React, { useEffect, useState } from 'react';
import Slider from '@react-native-community/slider';
import { View } from 'react-native';
import { Input } from '@/src/shared/ui/Input';
import { useForm } from 'react-hook-form';
import { ButtonCustom } from '@/src/shared/ui/ButtonCustom';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import { toast } from '@/src/shared/lib/utils/toast';

interface FormProps {
  minRating: string;
  maxRating: string;
}

export const Sliders = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [minSliderValue, setMinSliderValue] = useState(200);
  const [maxSliderValue, setMaxSliderValue] = useState(800);

  const { control, setValue } = useForm<FormProps>({
    defaultValues: {
      minRating: String(minSliderValue),
      maxRating: String(maxSliderValue),
    },
  });
  const { dismiss } = useBottomSheetModal();

  useEffect(() => {
    setIsLoaded(false);
    const getValues = async () => {
      const min = await AsyncStorage.getItem('minRating');
      const max = await AsyncStorage.getItem('maxRating');

      setMaxSliderValue(Number(max));
      setMinSliderValue(Number(min));

      setValue('minRating', min || '200');
      setValue('maxRating', max || '800');

      setIsLoaded(true);
    };
    getValues();
  }, []);

  const handleMinSliderChange = (value: number) => {
    const maxLimit = maxSliderValue - 300;
    const newValue = Math.min(value, maxLimit);
    setMinSliderValue(newValue);
    setValue('minRating', String(newValue));
  };

  const handleMaxSliderChange = (value: number) => {
    const minLimit = minSliderValue + 300;
    const newValue = Math.max(value, minLimit);
    setMaxSliderValue(newValue);
    setValue('maxRating', String(newValue));
  };

  const saveValues = async () => {
    await AsyncStorage.setItem('minRating', String(minSliderValue));
    await AsyncStorage.setItem('maxRating', String(maxSliderValue));
    dismiss();
    toast({ type: 'success', message: 'Options were successfully saved' });
  };

  if (!isLoaded) return null;

  console.log(minSliderValue, maxSliderValue);

  return (
    <View className={'flex flex-col gap-2'}>
      <View>
        <Input label={'Min. Rating'} control={control} name={'minRating'} readOnly />
        <Slider
          minimumTrackTintColor={'#DA0C81'}
          thumbTintColor={'#FAFAFA'}
          minimumValue={200}
          maximumValue={maxSliderValue - 400}
          step={50}
          value={minSliderValue}
          onValueChange={handleMinSliderChange}
        />
      </View>
      <View className={'mb-5'}>
        <Input label={'Max. Rating'} control={control} name={'maxRating'} readOnly />
        <Slider
          minimumTrackTintColor={'#DA0C81'}
          thumbTintColor={'#FAFAFA'}
          minimumValue={minSliderValue + 300}
          maximumValue={3400}
          step={50}
          value={maxSliderValue}
          onValueChange={handleMaxSliderChange}
        />
      </View>
      <ButtonCustom
        text={'Save'}
        isLight
        padding={6}
        textClassName={'text-xl'}
        onPress={saveValues}
      />
    </View>
  );
};
