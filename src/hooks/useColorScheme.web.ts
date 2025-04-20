import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { useApi } from './api';
import { Colors } from '../constants/colors';

export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}

export const useCurrentThemeColors = () => {
  const { theme } = useApi();
  return {
    ...Colors[useColorScheme() || 'light'],
    ...(theme || {}),
  };
};
