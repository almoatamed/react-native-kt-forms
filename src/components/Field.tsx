import {
  Pressable,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { type ThemedTextProps, ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import type { Merge } from './UnvalidatedInputs/TonalTextInput';
export type FieldProps = Merge<
  {
    label?: string;
    value?: string | number;
    style?: StyleProp<TextStyle>;
    onPress?: () => void;
    fieldContainerStyle?: StyleProp<ViewStyle>;
  },
  ThemedTextProps
>;

export const Field = ({
  label,
  value,
  style,
  fieldContainerStyle,
  onPress,
  ...props
}: FieldProps) => {
  const content = (
    <ThemedView style={fieldContainerStyle}>
      <ThemedText {...props} style={style}>
        {label && (
          <ThemedText
            style={[
              style,
              {
                fontWeight: '700',
              },
            ]}
          >
            {label}
            {value && `: `}
          </ThemedText>
        )}
        {value && <ThemedText style={style}>{value}</ThemedText>}
      </ThemedText>
    </ThemedView>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }
  return content;
};
