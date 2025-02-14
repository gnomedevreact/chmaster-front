import React, { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import { storage } from '@/src/core/lib/store/storage';
import { TextStyled } from '@/src/shared/ui/TextStyled';
import { cn } from '@/src/shared/lib/utils/cnUtils';

const THEMES = [
  'ALL',
  'doublecheck',
  'mate',
  'matein1',
  'matein2',
  'matein3',
  'matein4',
  'matein5',
  'opening',
  'middlegame',
  'endgame',
  'fork',
  'pin',
  'skewer',
  'deflection',
  'enpassant',
  'xray',
  'defensive',
  'attraction',
  'sacrifice',
  'hanging',
  'castling',
  'rookendgame',
];

export const Themes = ({ setTheme }: { setTheme: (e: string) => void }) => {
  const checkedTheme = storage.getString('theme');

  useEffect(() => {
    if (checkedTheme) {
      setTheme(checkedTheme);
    }
  }, [checkedTheme]);

  const handleCheckTheme = (theme: string) => {
    storage.set('theme', theme);
    setTheme(theme);
  };

  return (
    <View className="flex flex-row flex-wrap gap-2 mb-10">
      <TextStyled className="text-primary-600 text-lg mb-2">
        All themes are installed by default (there are more of them than are presented
        here)
      </TextStyled>

      {THEMES.map((theme, index) => {
        return (
          <View className={cn({ 'w-full': theme === 'ALL' })} key={index}>
            <Pressable
              className={cn('p-2 border rounded self-start')}
              onPress={() => {
                handleCheckTheme(theme);
              }}
              style={{ borderColor: '#A0A0A0' }}
            >
              <TextStyled
                className={cn({
                  'text-primary-white': theme === checkedTheme,
                  'text-primary-100': theme === checkedTheme,
                })}
              >
                {theme}
              </TextStyled>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
};
