import {
  ActivityIndicator,
  Pressable,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { staticColors } from '../constants/colors';
import { useCurrentThemeColors } from '../hooks/useColorScheme';
import { ThemedText } from './ThemedText';
export type ColorTypes = 'primary' | 'error' | 'warning' | 'success';
export type Props = {
  onPress: () => any;
  label?: string;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  type?: ColorTypes;
  disabled?: boolean;
  loading?: boolean;
  testID?: string;
  children?: React.ReactNode;
  variant?: VariantName;
};

const defaultVariant: VariantName = 'filled';
type VariantName = 'text' | 'filled' | 'outlined';

const defaultFontSize = 18;
const buttonVariantsStyleMap = (
  variant: VariantName,
  textColor: string,
  backgroundColor: string
) => {
  const backgroundStyles = StyleSheet.create({
    outlined: {
      borderRadius: 12,
      borderWidth: 1,
      paddingVertical: 2,
      paddingHorizontal: 12,
      alignItems: 'center',
      borderColor: backgroundColor,
    },
    text: {
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    filled: {
      borderRadius: 12,
      paddingHorizontal: 12,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 5,
      backgroundColor,
    },
  });

  const textStyles = StyleSheet.create({
    outlined: {
      fontSize: defaultFontSize - 5,
      color: backgroundColor,
      verticalAlign: 'middle',
      lineHeight: 24,
    },
    text: {
      fontSize: defaultFontSize - 5,
      color: backgroundColor,
      verticalAlign: 'bottom',
    },
    filled: {
      fontSize: defaultFontSize - 4,
      color: textColor,
      textAlign: 'center',
      verticalAlign: 'middle',
      lineHeight: 24,
    },
  });

  return {
    textStyle: textStyles[variant],
    backgroundStyle: backgroundStyles[variant],
  };
};

export const Button = (props: Props) => {
  const theme = useCurrentThemeColors();
  const isLoading = props.loading;
  const isDisabled = props.disabled;
  const primary = theme?.primary;
  const onPrimary = theme?.onPrimary;

  let textColor = onPrimary;
  let backgroundColor = primary;
  if (isDisabled) {
    textColor = staticColors.disabled + '99';
    backgroundColor =
      staticColors.disabled + (props.variant == 'text' ? '55' : '22');
  } else {
    if (props.type == 'error') {
      backgroundColor = staticColors.error;
      textColor = staticColors.onError;
    } else if (props.type == 'success') {
      textColor = staticColors.onSuccess;
      backgroundColor = staticColors.success;
    } else if (props.type == 'warning') {
      textColor = staticColors.onWarning;
      backgroundColor = staticColors.warning;
    }
  }
  const variantStyling = buttonVariantsStyleMap(
    props.variant || defaultVariant,
    textColor,
    backgroundColor
  );

  return (
    <Pressable
      onPress={() => {
        (async () => {
          try {
            await props.onPress();
          } catch (error) {
            console.log(error);
          }
        })();
      }}
      disabled={isDisabled}
      style={[
        {
          flexDirection: 'row',
          minHeight: 28,
          alignItems: 'center',
          gap: 12,
          paddingVertical: 22,
          justifyContent: 'center',
        },
        variantStyling.backgroundStyle,
        props.containerStyle,
      ]}
      testID={props.testID}
    >
      {props.label && (
        <ThemedText
          style={[
            {
              textAlign: 'center',
            },
            variantStyling.textStyle,
            props.textStyle,
          ]}
        >
          {isLoading ? <ActivityIndicator color={textColor} /> : props.label}
        </ThemedText>
      )}
      {props.children && (
        <ThemedText style={[variantStyling.textStyle]}>
          {props.children}
        </ThemedText>
      )}
    </Pressable>
  );
};
