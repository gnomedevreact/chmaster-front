import React from 'react';
import { cn } from '@/src/shared/lib/utils/cnUtils';
import { TextInput, TextInputProps } from 'react-native-paper';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { KeyboardTypeOptions, View } from 'react-native';
import { Control, RegisterOptions, useController } from 'react-hook-form';

interface InputProps extends TextInputProps {
  label: string;
  control: Control<any>;
  name: string;
  className?: string;
  keyboardType?: KeyboardTypeOptions;
  secure?: boolean;
  rules?: RegisterOptions<any>;
}

export const Input = (props: InputProps) => {
  const { label, className, control, name, keyboardType, secure, rules, ...otherProps } =
    props;

  const { field } = useController({
    control,
    name,
    rules,
  });

  return (
    <View className={'flex flex-col gap-2'}>
      <TextStyled className={'text-primary-white text-sm font-normal opacity-80'}>
        {label}
      </TextStyled>
      <TextInput
        value={field.value}
        onChangeText={field.onChange}
        className={cn(
          'w-full text-base font-normal text-primary-white rounded-xl bg-primary-200 focus:border focus:border-primary-300',
          className,
        )}
        underlineColor={'transparent'}
        activeUnderlineColor={'transparent'}
        selectionColor={'#FFFFFF'}
        style={{
          backgroundColor: 'transparent',
          height: 48,
          borderRadius: 14,
        }}
        keyboardType={keyboardType}
        secureTextEntry={secure}
        autoCapitalize={'none'}
        {...otherProps}
      />
    </View>
  );
};
