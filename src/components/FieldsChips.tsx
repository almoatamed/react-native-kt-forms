import { Fields, type FieldsProps } from './Fields';
import { useCurrentThemeColors } from '../hooks/useColorScheme';
export type FieldsChipsProps = FieldsProps & { color?: string };
export const FieldsChips = (props: FieldsChipsProps) => {
  const theme = useCurrentThemeColors();
  return (
    <Fields
      {...props}
      containerStyle={[
        {
          flexDirection: 'row',
          gap: 12,
          flexWrap: 'wrap',
          alignItems: 'center',
        },
        props.containerStyle,
      ]}
      fieldContainerStyle={{
        minHeight: 32,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 12,
        padding: 4,
        borderWidth: 1,
        borderColor: props.color || theme.onSurface,
      }}
      style={[
        {
          lineHeight: 22,
          fontSize: 14,
          color: props.color || theme.onSurface,
          verticalAlign: 'middle',
        },
        props.style,
      ]}
    ></Fields>
  );
};
