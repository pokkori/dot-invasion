import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { usePlayerStore } from '../src/stores/playerStore';
import { migrateIfNeeded } from '../src/utils/storage';

export default function RootLayout() {
  const load = usePlayerStore(s => s.load);

  useEffect(() => {
    (async () => {
      await migrateIfNeeded();
      await load();
    })();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0A0A1E' },
          animation: 'slide_from_right',
        }}
      />
    </>
  );
}
