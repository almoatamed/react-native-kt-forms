import { memo, useEffect } from 'react';
import { TouchableOpacity, type ViewProps } from 'react-native';
import { useFormValidation } from '../../UseFormValidation';
import { ThemedText } from '../../../ThemedText';
import { ThemedView } from '../../../ThemedView';
import { useCurrentThemeColors } from '../../../../hooks/useColorScheme';
import type { RulesList } from '../../../../client-validation-rules';

const Text = ThemedText;
const View = ThemedView;

const RadioButton = (props: {
  onPress: () => void;
  color?: string;
  status: 'checked' | 'unchecked';
  value: number | string;
  disabled?: boolean;
}) => {
  const theme = useCurrentThemeColors();

  return (
    <TouchableOpacity
      key={props.value}
      disabled={props.disabled}
      onPress={props.onPress}
      style={{ flexDirection: 'row', alignItems: 'center' }}
    >
      <View
        style={{
          height: 24,
          width: 24,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: !props.disabled
            ? props.color || theme.primary
            : theme.secondary,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {props.status == 'checked' && (
          <View
            style={{
              height: 12,
              width: 12,
              borderRadius: 6,
              backgroundColor: props.color || theme.primary,
            }}
          />
        )}
      </View>
      <Text style={{ marginLeft: 10 }}>{props.value}</Text>
    </TouchableOpacity>
  );
};

type OptionsButtonsProps = {
  defaultValue?: string;
  onValueChange: (value: string | null) => void;
  loading?: boolean;
  label: string;
  disabled?: boolean;
  rules?: RulesList;
  options: {
    text: string;
    value: string;
  }[];
  id?: string;
  value: string | null;
  containerProps?: ViewProps;
  LabelContainerProps?: ViewProps;
  optionsContainerProps?: ViewProps;
};

export const RawOptionsButtons = (props: OptionsButtonsProps) => {
  const theme = useCurrentThemeColors();
  const formContext = useFormValidation({
    id: props.id,
    rules: props.rules,
    initialValue: props.value,
    onReset: (m) => {
      if (m) {
        return;
      }
      props.onValueChange(props.defaultValue || null);
    },
  });

  useEffect(() => {
    formContext.setValue(props.value);
  }, [props.value]);

  return (
    <>
      <View style={{ gap: 4 }} {...props.containerProps}>
        <View
          style={{
            paddingHorizontal: 10,
          }}
          {...props.containerProps}
        >
          <Text style={{ fontSize: 14, color: theme.onBackground }}>
            {props.label}
            {!!formContext.required ? (
              <>
                <Text style={{ color: 'red' }}>*</Text>
              </>
            ) : (
              ''
            )}
          </Text>
        </View>
        <View {...props.optionsContainerProps}>
          {props.options.map((option, index) => {
            return (
              <View
                key={`${index}`}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}
                >
                  {option.text}
                </Text>
                <RadioButton
                  onPress={() => {
                    if (props.disabled || props.value == option.value) {
                      return;
                    }
                    props.onValueChange(option.value);
                    formContext.setValue(option.value);
                  }}
                  color={props.disabled ? theme.secondary : theme.primary}
                  status={props.value == option.value ? 'checked' : 'unchecked'}
                  value={option.value}
                  disabled={props.disabled || formContext.disabled}
                />
              </View>
            );
          })}
        </View>
        {formContext.validationErrorMessage && (
          <Text
            style={{
              paddingHorizontal: 12,
              color: theme.error,
            }}
          >
            {formContext.validationErrorMessage}
          </Text>
        )}
      </View>
    </>
  );
};

export const OptionsButtons = memo(RawOptionsButtons);
