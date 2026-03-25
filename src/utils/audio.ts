import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

let bgmSound: Audio.Sound | null = null;
let bgmEnabled = true;
let seEnabled = true;

export async function playBGM(): Promise<void> {
  if (!bgmEnabled) return;
  try {
    if (bgmSound) {
      await bgmSound.stopAsync();
      await bgmSound.unloadAsync();
    }
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    // BGM asset placeholder - replace with actual asset when available
    // const { sound } = await Audio.Sound.createAsync(require('../../assets/audio/bgm.mp3'), { isLooping: true, volume: 0.4 });
    // bgmSound = sound;
    // await sound.playAsync();
  } catch (e) {
    console.warn('[Audio] playBGM failed:', e);
  }
}

export async function stopBGM(): Promise<void> {
  try {
    if (bgmSound) {
      await bgmSound.stopAsync();
      await bgmSound.unloadAsync();
      bgmSound = null;
    }
  } catch (e) {
    console.warn('[Audio] stopBGM failed:', e);
  }
}

export function setBgmEnabled(enabled: boolean): void {
  bgmEnabled = enabled;
  if (!enabled) stopBGM();
}

export function setSeEnabled(enabled: boolean): void {
  seEnabled = enabled;
}

type SEType = 'deploy' | 'attack' | 'destroy' | 'victory' | 'defeat' | 'coin';

export async function playSE(type: SEType): Promise<void> {
  // Haptics as SE fallback until audio assets are ready
  if (!seEnabled) return;
  try {
    switch (type) {
      case 'deploy':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'attack':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'destroy':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'victory':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'defeat':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case 'coin':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
    }
  } catch (e) {
    // Haptics not available in simulator/web
  }
}
