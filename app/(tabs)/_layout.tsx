import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0D0D24',
          borderTopColor: '#1A1A3E',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 6,
        },
        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: '#666688',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'ホーム',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="editor"
        options={{
          title: 'エディタ',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🎨</Text>,
        }}
      />
      <Tabs.Screen
        name="army"
        options={{
          title: '軍団',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>⚔️</Text>,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'ショップ',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🛒</Text>,
        }}
      />
    </Tabs>
  );
}
