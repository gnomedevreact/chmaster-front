import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, View } from 'react-native';
import { Button } from '@/src/shared/ui/Button';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { useForm } from 'react-hook-form';
import { Input } from '@/src/shared/ui/Input';
import { Ionicons } from '@expo/vector-icons';
import { useUpdateProfile } from '@/src/shared/api/hooks/ProfilesHooks/useUpdateProfile';
import { DeleteModal } from '@/src/widgets/Avatar/ui/components/DeleteModal';

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

  const [isDeleteModal, setIsDeleteModal] = useState(false);

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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={40}
        style={{ flex: 1 }}
        className={'bg-primary-400 px-4 py-10'}
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
          <View className={'mt-auto flex flex-col gap-4'}>
            <TextStyled className={'self-center text-primary-600'}>
              info@chessmasterlinks.casa
            </TextStyled>
            <Button isLight={false} onPress={() => setIsDeleteModal(true)}>
              <TextStyled className={'text-base'}>Delete account</TextStyled>
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
      {isDeleteModal && <DeleteModal closeModal={() => setIsDeleteModal(false)} />}
    </Modal>
  );
};
