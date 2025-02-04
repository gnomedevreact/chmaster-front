import React, { useEffect, useRef } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
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

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormProps>({
    defaultValues: {
      name,
    },
  });

  const { updateProfile, isPending } = useUpdateProfile();

  useEffect(() => {
    if (modalVisible) {
      bottomSheetRef.current?.present();
    }
  }, [modalVisible]);

  const submit = (data: FormProps) => {
    updateProfile(data);
  };

  return (
    <Modal
      visible={modalVisible}
      presentationStyle={'formSheet'}
      animationType={'slide'}
      className={'flex-1'}
    >
      <View className={'flex flex-1 flex-col gap-4 pb-4 bg-primary-400 p-4'}>
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
      </View>
    </Modal>
  );
};
