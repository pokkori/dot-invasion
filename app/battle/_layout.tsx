import { Stack } from 'expo-router';

export default function BattleLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0A0A1E' },
        animation: 'slide_from_right',
      }}
    />
  );
}
