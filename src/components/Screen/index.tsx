import React, { createContext, useContext } from 'react';
import {
  Platform,
  ScrollView,
  type ScrollViewProps,
  type ViewProps,
} from 'react-native';
import { useCurrentThemeColors } from '../../hooks/useColorScheme';

type ScreenContext =
  | {
      hasScreen: true;
      id: string;
    }
  | {
      hasScreen: false;
    };

const screenContext = createContext<ScreenContext>({
  hasScreen: false,
});

export const useScreen = () => {
  return useContext(screenContext);
};

export type HeaderOptions = React.PropsWithChildren<
  {
    headerOptions?: {
      fixed?: boolean;
      hideHeader?: boolean;
      headerContainerOptions?: ViewProps;
      Header?: () => React.JSX.Element;
      title?: string;
    };
    title?: string;
    id: string;
    onSwipeRight?: () => void;
    onSwipeLeft?: () => void;
    onGoBack?: () => void;
  } & ScrollViewProps
>;

export type ScreenProps = React.PropsWithChildren<
  {
    title?: string;
    id: string;
  } & ScrollViewProps
>;
export default function Screen(allProps: ScreenProps) {
  const { id, title, children, ...props } = allProps;
  const theme = useCurrentThemeColors();
  const ctx = useScreen();

  if (ctx.hasScreen) {
    return <>{children}</>;
  }

  return (
    <>
      <screenContext.Provider
        value={{
          hasScreen: true,
          id: id,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          {...props}
          contentContainerStyle={[
            {
              width: '100%',
              maxWidth: 726,
              marginHorizontal: 'auto',
              padding: Platform.OS == 'android' ? 12 : 16,
              gap: 12,
              minHeight: '100%',
            },
            props?.contentContainerStyle,
          ]}
          style={[
            {
              backgroundColor: theme.surface,
            },
            props.style,
          ]}
          testID={`${id}-screen`}
        >
          {children}
        </ScrollView>
      </screenContext.Provider>
    </>
  );
}
