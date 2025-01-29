import React, { useEffect, useState } from 'react';
import Slider from '@react-native-community/slider';
import { View } from 'react-native';
import { Input } from '@/src/shared/ui/Input';
import { useForm } from 'react-hook-form';
import { ButtonCustom } from '@/src/shared/ui/ButtonCustom';
import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import { toast } from '@/src/shared/lib/utils/toast';
import { storage } from '@/src/core/lib/store/storage';

interface FormProps {
  minRating: string;
  maxRating: string;
}

export const Sliders = () => {
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
    const getValues = async () => {
      const min = storage.getString('minRating');
      const max = storage.getString('maxRating');

      const parsedMin = Math.max(Number(min) || 200, 200);
      const parsedMax = Math.min(Number(max) || 800, 3400);

      setMaxSliderValue(parsedMax);
      setMinSliderValue(parsedMin);

      setValue('minRating', String(parsedMin));
      setValue('maxRating', String(parsedMax));
    };
    getValues();
  }, []);

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

  const saveValues = async () => {
    storage.set('minRating', String(minSliderValue));
    storage.set('maxRating', String(maxSliderValue));
    dismiss();
    toast({ type: 'success', message: 'Options were successfully saved' });
  };

  return (
    <View className={'flex flex-col gap-2'}>
      <View>
        <Input label={'Min. Rating'} control={control} name={'minRating'} readOnly />
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
        <Input label={'Max. Rating'} control={control} name={'maxRating'} readOnly />
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
