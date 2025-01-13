import { Pressable, StyleSheet, Text, View } from 'react-native';
import { supabase } from '@/src/core/lib/supabase';
import { router } from 'expo-router';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} />
      <Pressable
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
}

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
