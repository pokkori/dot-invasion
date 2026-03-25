import React from 'react';
import Svg, { Circle, Path, Rect, Polygon } from 'react-native-svg';

export type IconName = 'coin' | 'gem' | 'trophy' | 'target' | 'star' | 'fire' | 'shield' | 'sword';

interface IconSvgProps {
  name: IconName;
  size?: number;
  color?: string;
}

export const IconSvg: React.FC<IconSvgProps> = ({ name, size = 20, color = '#FFFFFF' }) => {
  switch (name) {
    case 'coin':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="コイン">
          <Circle cx="12" cy="12" r="10" fill="#FFD700" />
          <Circle cx="12" cy="12" r="8" fill="#FFA000" />
          <Path d="M12 7v10M9 9h4.5c.83 0 1.5.67 1.5 1.5S14.33 12 13.5 12H10.5c-.83 0-1.5.67-1.5 1.5S9.67 15 10.5 15H15" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
        </Svg>
      );

    case 'gem':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="ジェム">
          <Path d="M5 7l-2 5 9 9 9-9-2-5H5zm7 10.5L5.5 12H18.5L12 17.5z" fill="#64B5F6" />
          <Path d="M8 7l-1 5h10l-1-5H8z" fill="#90CAF9" />
        </Svg>
      );

    case 'trophy':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="トロフィー">
          <Path d="M12 15c-3.31 0-6-2.69-6-6V3h12v6c0 3.31-2.69 6-6 6z" fill="#FFD700" />
          <Path d="M6 3H3v3c0 1.66 1.34 3 3 3V3z" fill="#FFB300" />
          <Path d="M18 3h3v3c0 1.66-1.34 3-3 3V3z" fill="#FFB300" />
          <Rect x="9" y="15" width="6" height="2" fill="#FFD700" />
          <Rect x="7" y="17" width="10" height="2" fill="#FFD700" />
        </Svg>
      );

    case 'target':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="ターゲット">
          <Circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="2" />
          <Circle cx="12" cy="12" r="6" fill="none" stroke={color} strokeWidth="2" />
          <Circle cx="12" cy="12" r="2" fill={color} />
        </Svg>
      );

    case 'star':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="スター">
          <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FFD700" />
        </Svg>
      );

    case 'fire':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="炎">
          <Path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z" fill="#FF6B35" />
        </Svg>
      );

    case 'shield':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="シールド">
          <Path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill="#4CAF50" />
        </Svg>
      );

    case 'sword':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="ソード">
          <Path d="M6.5 17.5l-1.5 1.5 1.5 1.5L8 19l-1.5-1.5zM15 6l-8 8 1.5 1.5 8-8L15 6z" fill={color} />
          <Path d="M20 3l-8.5 8.5 1.5 1.5L21 4.5 20 3z" fill={color} />
        </Svg>
      );

    default:
      return null;
  }
};
