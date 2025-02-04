import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useVideoPlayer, VideoThumbnail, VideoView } from 'expo-video';
import { BlurView } from 'expo-blur';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useEvent } from 'expo';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { convertVideoInfo } from '@/src/screens/Videos/lib/utils/convertVideoInfo';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofaya';

export const VideoBlock = ({
  videoSource,
  path,
}: {
  videoSource: string;
  path: string;
}) => {
  const [thumbNail, setThumbNail] = useState<VideoThumbnail>();
  const videoPlayerRef = useRef<VideoView>(null);

  const player = useVideoPlayer(videoSource, async (player) => {
    player.loop = true;
  });

  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  const handlePlay = () => {
    videoPlayerRef?.current?.enterFullscreen();
    return isPlaying ? player.pause() : player.play();
  };

  const videoInfo = useMemo(() => convertVideoInfo(path), [path]);

  useEffect(() => {
    if (player) {
      (async () => {
        const thumb = await player.generateThumbnailsAsync(10);
        if (thumb) {
          setThumbNail(thumb[0]);
        }
      })();
    }
  }, []);

  return (
    <View className={'flex flex-col gap-5 p-6 bg-primary-200 rounded-[14px]'}>
      <View className={'flex flex-col gap-4'}>
        <View className={'flex flex-row flex-wrap gap-2'}>
          <TextStyled
            className={'text-[24px] text-primary-100'}
            fontFamilyName={'NunitoSansBold'}
          >
            {videoInfo?.name}
          </TextStyled>
          <TextStyled className={'text-[24px]'} fontFamilyName={'NunitoSansBold'}>
            {videoInfo?.title}
          </TextStyled>
        </View>
        <TextStyled className={'text-base text-primary-600'}>
          {videoInfo?.description}
        </TextStyled>
      </View>
      <View className={'relative'}>
        <VideoView
          ref={videoPlayerRef}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
          style={{ width: '100%', height: 200 }}
          nativeControls={true}
          onFullscreenExit={() => {
            videoPlayerRef?.current?.startPictureInPicture();
          }}
        />
        {!isPlaying && (
          <Pressable
            className={
              'absolute w-full h-[200px] flex items-center justify-center overflow-hidden'
            }
            onPress={handlePlay}
          >
            <BlurView
              intensity={50}
              className={
                'flex items-center justify-center w-full h-full max-w-[60px] max-h-[60px] rounded-full overflow-hidden'
              }
            >
              <FontAwesome name="play" size={25} color="white" />
            </BlurView>
          </Pressable>
        )}
      </View>
    </View>
  );
};
