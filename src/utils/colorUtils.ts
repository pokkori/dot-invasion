import { PixelColor } from '../types/unit';

export function pixelToHex(color: PixelColor): string {
  if (color.a === 0) return 'transparent';
  const r = color.r.toString(16).padStart(2, '0');
  const g = color.g.toString(16).padStart(2, '0');
  const b = color.b.toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

export function pixelToRgba(color: PixelColor): string {
  return `rgba(${color.r},${color.g},${color.b},${color.a})`;
}

export function hexToPixel(hex: string, alpha: number = 1): PixelColor {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
    a: alpha,
  };
}

export function colorsEqual(a: PixelColor, b: PixelColor): boolean {
  return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;
}
