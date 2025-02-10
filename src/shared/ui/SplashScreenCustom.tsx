import React, { useEffect } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

type CustomSplashScreenProps = {
  onFinish: () => void;
};

const CustomSplashScreen: React.FC<CustomSplashScreenProps> = ({ onFinish }) => {
  const opacity = new Animated.Value(0);
  const scale = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1200,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(onFinish, 500);
    });
  }, []);

  return (
    <Animated.View
      style={[styles.container, { opacity }]}
      className={'flex flex-row items-center justify-center bg-primary-400'}
    >
      <Animated.Image
        source={require('../../assets/images/new.png')}
        style={[styles.logo, { transform: [{ scale }] }]}
      />
      <Animated.Text style={[styles.title, { transform: [{ scale }] }]}>
        ChessMaster
        <View className={'w-4 h-4 bg-primary-100 rounded-full'} />
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    width: 60,
    height: 100,
  },
  title: {
    fontSize: 42,
    color: '#FAFAFA',
    marginTop: 20,
  },
});

export default CustomSplashScreen;
