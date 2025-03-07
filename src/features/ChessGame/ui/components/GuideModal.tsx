import React, { useState } from 'react';
import { Modal, View } from 'react-native';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { Button } from '@/src/shared/ui/Button';
import { storage } from '@/src/core/lib/store/storage';
import { Portal } from 'react-native-paper';

export const GuideModal = () => {
  const guidePassed = storage.getBoolean('guide');

  const [isOpen, setIsOpen] = useState(!guidePassed);

  const closeModal = () => {
    setIsOpen(false);
    storage.set('guide', true);
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <Modal transparent={true} onRequestClose={closeModal}>
        <View className={'flex-1 flex items-center justify-center bg-[#00000099]'}>
          <View
            className={
              'flex flex-col gap-10 bg-primary-400 p-10 rounded border border-primary-500'
            }
          >
            <View>
              <TextStyled className={'text-white text-[24px]'}>
                Welcome to ChessMaster!
              </TextStyled>
              <TextStyled className={'text-primary-600 text-base'}>
                You're now on the chess puzzles page. Use the gear icon in the top-right
                corner to adjust rating limits, puzzle themes, and difficulty.
              </TextStyled>
            </View>
            <View className={'flex flex-col gap-2'}>
              <Button onPress={closeModal}>
                <TextStyled className={'text-base'}>I understood</TextStyled>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};
