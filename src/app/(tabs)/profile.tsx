import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { supabase } from '@/src/core/lib/supabase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';

const ProfilePage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} />
      <Pressable
        className={'mb-10'}
        onPress={async () => {
          await supabase.auth.signOut();
          await GoogleSignin.signOut();
          router.replace('/auth');
        }}
      >
        <Text className={'text-red-600'}>Sign Out</Text>
      </Pressable>
      <Pressable
        onPress={async () => {
          router.replace('/auth');
        }}
      >
        <Text className={'text-red-600'}>Auth</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

export default ProfilePage;
