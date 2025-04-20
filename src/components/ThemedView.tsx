import { Pressable, View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  disabled?: boolean;
  onPress?: () => void | Promise<void>;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  onPress,
  ...otherProps
}: ThemedViewProps) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={[{}, style]}
        {...otherProps}
      ></Pressable>
    );
  }

  return <View style={[{}, style]} {...otherProps} />;
}
