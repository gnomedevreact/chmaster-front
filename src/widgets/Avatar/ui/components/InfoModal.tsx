import React from 'react';
import { Modal, View } from 'react-native';
import { Button } from '@/src/shared/ui/Button';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { useForm } from 'react-hook-form';
import { Input } from '@/src/shared/ui/Input';
import { Ionicons } from '@expo/vector-icons';
import { useUpdateProfile } from '@/src/shared/api/hooks/ProfilesHooks/useUpdateProfile';

interface InfoModalProps {
  modalVisible: boolean;
  setModalVisible: (e: boolean) => void;
  name: string;
}

interface FormProps {
  name: string;
}

export const InfoModal = (props: InfoModalProps) => {
  const { modalVisible, setModalVisible, name } = props;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormProps>({
    defaultValues: {
      name,
    },
    reValidateMode: 'onBlur',
  });

  const { updateProfile, isPending } = useUpdateProfile();

  const submit = (data: FormProps) => {
    updateProfile(data);
  };

  return (
    <Modal
      visible={modalVisible}
      presentationStyle={'formSheet'}
      animationType={'slide'}
      className={'flex-1'}
      onRequestClose={() => setModalVisible(false)}
    >
      <View className={'flex flex-1 flex-col gap-4 pb-20 bg-primary-400 p-4'}>
        <Button
          className={'w-[50px] h-[50px] mb-10'}
          isLight={false}
          onPress={() => setModalVisible(false)}
        >
          <Ionicons name="arrow-back" size={20} color="white" />
        </Button>
        <View className={'flex flex-col gap-5'}>
          <Input
            control={control}
            name={'name'}
            label={'Name'}
            rules={{
              required: true,
              maxLength: {
                value: 10,
                message: 'Max len 10',
              },
            }}
            errorText={errors.name?.message}
          />
          <Button
            className={'py-4'}
            isLoading={isPending}
            disabled={isPending}
            onPress={handleSubmit(submit)}
          >
            <TextStyled className={'text-base'}>Save</TextStyled>
          </Button>
        </View>
        <TextStyled className={'self-center mt-auto text-primary-600'}>
          chessmaster.help@gmail.com
        </TextStyled>
      </View>
    </Modal>
  );
};
