import {
  ScrollView,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { Field, type FieldProps } from './Field';
import { ThemedText } from './ThemedText';

export type FieldsProps = {
  defaultProps?: FieldProps;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  fieldContainerStyle?: StyleProp<ViewStyle>;
  clip?: number;
  perRow?: number;
  oneRow?: boolean;
  fields: FieldProps[];
};

export const Fields = ({
  perRow,
  oneRow,
  fields,
  style,
  clip,
  fieldContainerStyle,
  containerStyle,
  defaultProps,
}: FieldsProps) => {
  const minWidth: `${number}%` | undefined = !perRow
    ? undefined
    : `${Math.floor(95 / perRow)}%`;
  const clipped = clip ? fields.slice(0, clip) : fields;
  return (
    <ScrollView
      horizontal={oneRow}
      contentContainerStyle={[
        { flexDirection: perRow ? 'row' : undefined, flexWrap: 'wrap', gap: 2 },
        containerStyle,
      ]}
    >
      {clipped.map((item, index) => {
        return (
          <Field
            {...defaultProps}
            {...item}
            fieldContainerStyle={[
              {
                minWidth: minWidth,
              },
              item.fieldContainerStyle || fieldContainerStyle,
            ]}
            key={String(index)}
            label={item.label}
            value={item.value}
            style={item.style || style}
          ></Field>
        );
      })}
      {!!clip && fields?.length > clip && (
        <>
          <ThemedText>... and {fields.length - clip} more</ThemedText>
        </>
      )}
    </ScrollView>
  );
};
