import React, { useEffect, useRef } from 'react';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/src/shared/ui/Button';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { router } from 'expo-router';
import { storage } from '@/src/core/lib/store/storage';

const { width, height } = Dimensions.get('window');

const IntroPage = () => {
  const videoPlayerRef = useRef<VideoView>(null);
  const insets = useSafeAreaInsets();
  const opacity = new Animated.Value(1);

  const player = useVideoPlayer(require('../assets/videos/intro.mp4'), async (player) => {
    player.loop = false;
    player.play();
  });

  useEffect(() => {
    storage.set('intro', true);

    Animated.timing(opacity, {
      toValue: 0,
      duration: 2000,
      delay: 74000,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 77200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={[
        styles.videoContainer,
        { height: height - insets.top - insets.bottom, opacity },
      ]}
      className={'relative'}
    >
      <VideoView
        ref={videoPlayerRef}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
        style={styles.video}
        nativeControls={false}
      />
      <View className={'absolute top-0 left-0'}>
        <Button
          className={'w-[100px] bg-[#00A36C] !rounded-none rounded-br-2xl'}
          isLight={false}
          onPress={() => router.replace('/(tabs)')}
        >
          <TextStyled>Skip</TextStyled>
        </Button>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
    aspectRatio: 16 / 9,
  },
});

export default IntroPage;
