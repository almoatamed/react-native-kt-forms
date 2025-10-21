/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '../constants/colors';
import { useColorScheme, useCurrentThemeColors } from './useColorScheme';

export function useThemeColor(
  props?: { light?: string; dark?: string },
  colorName?: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props?.[theme];
  const Colors = useCurrentThemeColors()

  if (colorFromProps) {
    return colorFromProps;
  } else if(colorName) {
    return Colors[colorName];
  }
  return Colors.primary
}
