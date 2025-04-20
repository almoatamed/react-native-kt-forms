import { ActivityIndicator } from 'react-native';
import Screen from '../Screen';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { useCurrentThemeColors } from '../../hooks/useColorScheme';
import { defaultPadding } from '../../constants/styling';
const Text = ThemedText;
export const Loading = (props?: {
  loading_msg?: string | null;
  loadingMsg?: string | null;
}) => {
  const currentTheme = useCurrentThemeColors();
  return (
    <Screen id={'Loading...'}>
      <ThemedView
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        testID="loading"
      >
        <ActivityIndicator
          size={'large'}
          animating={true}
          color={currentTheme.primary}
        />
        {props?.loading_msg && (
          <ThemedView
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              padding: defaultPadding,
            }}
          >
            <Text
              style={{
                color: currentTheme.primary,
                fontSize: 22,
                fontWeight: '700',
              }}
            >
              {props?.loading_msg || props.loadingMsg}
            </Text>
          </ThemedView>
        )}
      </ThemedView>
    </Screen>
  );
};
