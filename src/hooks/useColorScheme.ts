import { useColorScheme } from 'react-native';
import { Colors } from '../constants/colors';
import { useApi } from './api';

export { useColorScheme } from 'react-native';

export const useCurrentThemeColors = () => {
  const { theme } = useApi();
  return {
    ...Colors[useColorScheme() || 'light'],
    ...(theme || {}),
  };
};
