import React, { useEffect, useRef } from 'react';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Sliders } from '@/src/features/ChessGame/ui/components/Sliders';
import { View } from 'react-native';

interface OptionsModalProps {
  modalVisible: boolean;
  setModalVisible: (e: boolean) => void;
}

export const OptionsModal = React.memo((props: OptionsModalProps) => {
  const { modalVisible, setModalVisible } = props;

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (modalVisible) {
      bottomSheetRef.current?.present();
    }
  }, [modalVisible]);

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        enablePanDownToClose={true}
        ref={bottomSheetRef}
        snapPoints={['70%', '75%']}
        index={0}
        onDismiss={() => setModalVisible(false)}
        backgroundStyle={{ backgroundColor: '#0F0F0F' }}
        handleIndicatorStyle={{ backgroundColor: '#FFFFFF' }}
        containerStyle={{ zIndex: 9999999 }}
      >
        <BottomSheetView style={{ flex: 1, paddingHorizontal: 16 }}>
          <View>
            <Sliders />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
});
