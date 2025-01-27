import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { FontAwesome5, FontAwesome6, Ionicons } from '@expo/vector-icons';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: 3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0F0F0F',
          borderTopWidth: 0,
          elevation: 0,
        },
        sceneStyle: { backgroundColor: '#0F0F0F' },
        tabBarLabelStyle: {
          fontFamily: 'NunitoSans',
          fontSize: 10,
          fontWeight: 400,
          marginTop: 6,
        },
        tabBarActiveTintColor: '#DA0C81',
        tabBarInactiveTintColor: '#FFFFFF',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="house" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="trainer"
        options={{
          title: 'Puzzles',
          tabBarIcon: ({ color }) => (
            <Ionicons name="extension-puzzle" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="freeplay"
        options={{
          title: 'Free game',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="chess-board" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="tasks" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
