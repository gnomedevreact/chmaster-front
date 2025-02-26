import React, { useState } from 'react';
import { Sliders } from '@/src/features/ChessGame/ui/components/Sliders';
import { Modal, ScrollView } from 'react-native';
import { Themes } from '@/src/features/ChessGame/ui/components/Themes';
import { BackButton } from '@/src/shared/ui/BackButton';
import { storage } from '@/src/core/lib/store/storage';
import { toast } from '@/src/shared/lib/utils/toast';
import { Button } from '@/src/shared/ui/Button';
import { TextStyled } from '@/src/shared/ui/TextStyled';

interface OptionsModalProps {
  modalVisible: boolean;
  setModalVisible: (e: boolean) => void;
}

export const OptionsModal = React.memo((props: OptionsModalProps) => {
  const { modalVisible, setModalVisible } = props;

  const [minSliderValue, setMinSliderValue] = useState(200);
  const [maxSliderValue, setMaxSliderValue] = useState(800);
  const [theme, setTheme] = useState<string>();

  const saveValues = async () => {
    storage.set('minRating', String(minSliderValue));
    storage.set('maxRating', String(maxSliderValue));
    storage.set('theme', theme || 'ALL');
    setModalVisible(false);
    toast({ type: 'success', message: 'Options were successfully saved' });
  };

  return (
    <Modal
      visible={modalVisible}
      presentationStyle={'formSheet'}
      animationType={'slide'}
      className={'flex-1'}
      hardwareAccelerated={true}
      onRequestClose={() => setModalVisible(false)}
    >
      <ScrollView
        className={'px-4 py-10 bg-primary-400'}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 150 }}
      >
        <BackButton customPress={() => setModalVisible(false)} className={'mb-10'} />
        <Sliders
          maxSliderValue={maxSliderValue}
          minSliderValue={minSliderValue}
          setMaxSliderValue={setMaxSliderValue}
          setMinSliderValue={setMinSliderValue}
        />
        <Themes setTheme={setTheme} />
        <Button onPress={saveValues}>
          <TextStyled>Save</TextStyled>
        </Button>
      </ScrollView>
    </Modal>
  );
});
