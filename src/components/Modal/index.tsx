import { useCallback } from 'react';
import { Modal as RNModal, type ViewStyle } from 'react-native';
import { Button } from '../Button';
import { ThemedView } from '../ThemedView';
import { useCurrentThemeColors } from '../../hooks/useColorScheme';
export const Portal = (props: { children: React.ReactNode }) => {
  return <>{props.children}</>;
};

type ModalProps = {
  children: React.ReactNode;
  visible: boolean;
  dismissibleBackButton?: boolean;
  onDismiss: () => void;
  dismissible?: boolean;
  style?: ViewStyle[] | ViewStyle;
  contentContainerStyle?: ViewStyle[] | ViewStyle;
};

export const Modal = (props: ModalProps) => {
  const dismiss = useCallback(() => {
    if (props.dismissible === false) {
      return;
    }
    props.onDismiss();
  }, [props.dismissible]);

  const theme = useCurrentThemeColors();

  return (
    // <RealPortal>
    <RNModal
      visible={props.visible}
      onDismiss={dismiss}
      onRequestClose={dismiss}
      presentationStyle={'fullScreen'}
    >
      <ThemedView
        style={[
          {
            backgroundColor: theme.surfaceDim,
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          },
        ]}
      >
        <ThemedView
          style={[
            {
              flex: 1,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}
        >
          <ThemedView
            style={[
              {
                width: '100%',
                padding: 12,
              },
              props.contentContainerStyle,
            ]}
          >
            {props.children}
          </ThemedView>
        </ThemedView>

        <ThemedView
          onPress={dismiss}
          style={{
            padding: 12,
            flex: 0,
          }}
        >
          <Button
            variant="text"
            label="Close"
            onPress={dismiss}
            disabled={props.dismissible}
          ></Button>
        </ThemedView>
      </ThemedView>
    </RNModal>
    // </RealPortal>
  );
};
