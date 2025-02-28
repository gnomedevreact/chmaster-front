import React from 'react';
import { Modal, View } from 'react-native';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { Button } from '@/src/shared/ui/Button';
import { useDeleteAccount } from '@/src/shared/api/hooks/ProfilesHooks/useDeleteAccount';

interface DeleteModalProps {
  closeModal: () => void;
}

export const DeleteModal = (props: DeleteModalProps) => {
  const { closeModal } = props;

  const { deleteAccount, isPendingDeletion } = useDeleteAccount();

  return (
    <Modal transparent={true} onRequestClose={closeModal}>
      <View className={'flex-1 flex items-center justify-center'}>
        <View
          className={
            'flex flex-col gap-10 bg-primary-400 p-10 rounded border border-primary-500'
          }
        >
          <View>
            <TextStyled className={'text-white text-[24px]'}>Delete Account</TextStyled>
            <TextStyled className={'text-primary-600 text-base'}>
              Are you sure you want to delete your account? This action is irreversible.
            </TextStyled>
          </View>
          <View className={'flex flex-col gap-2'}>
            <Button
              isLight={false}
              onPress={deleteAccount}
              isLoading={isPendingDeletion}
              disabled={isPendingDeletion}
            >
              <TextStyled className={'text-base'}>Delete</TextStyled>
            </Button>
            <Button onPress={closeModal} disabled={isPendingDeletion}>
              <TextStyled className={'text-base'}>Cancel</TextStyled>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};
