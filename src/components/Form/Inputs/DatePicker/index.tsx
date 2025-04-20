import { useEffect, useMemo } from 'react';
import DatePickerComponent from 'react-native-date-picker';
import { useFormValidation } from '../../UseFormValidation';
import { ThemedText } from '../../../ThemedText';
import type { RulesList } from '../../../../client-validation-rules';
import {
  useColorScheme,
  useCurrentThemeColors,
} from '../../../../hooks/useColorScheme';
import { dashDateFormatter } from '../../../../common';
import { TonalTextInput } from '../../../UnvalidatedInputs/TonalTextInput';

const Text = ThemedText;

export const RawDatePicker = (props: {
  onShow: () => void;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  title?: string;
  onClear?: (mounted_clear: boolean) => void;
  label?: string;
  shown: boolean;
  mode?: 'date' | 'time' | 'datetime' | undefined;
  minimum?: Date;
  maximum?: Date;
  value: Date | null;
  id?: string;
  disabled?: boolean;
  rules?: RulesList;
  errorMessage?: string;
  loading?: boolean;
}) => {
  const themeName = useColorScheme();
  const theme = useCurrentThemeColors();
  const formContext = useFormValidation({
    id: props.id,
    rules: props.rules,
    initialValue: props.value,
    onReset: (mounted_reset: boolean) => {
      if (props.onClear) {
        props.onClear?.(mounted_reset);
      } else {
        if (mounted_reset) {
          return;
        }
        props.onConfirm(new Date());
      }
    },
    dynamicRules: true,
  });

  useEffect(() => {
    formContext.setValue(props.value);
  }, [props.value]);

  const overall_error_message = useMemo(() => {
    return props.errorMessage || formContext.validationErrorMessage;
  }, [props.errorMessage, formContext.validationErrorMessage]);

  return (
    <>
      <DatePickerComponent
        modal
        theme={themeName == 'dark' ? 'dark' : 'light'}
        open={props.shown && !formContext.disabled && !props.disabled}
        date={props.value || new Date()}
        onConfirm={(date) => {
          props.onConfirm(date);
        }}
        onCancel={() => {
          props.onCancel();
        }}
        title={props.title}
        mode={props.mode || 'date'}
        minimumDate={props.minimum}
        maximumDate={props.maximum}
      />
      <TonalTextInput
        onChangeText={() => {}}
        onPress={props.onShow}
        value={
          props.value
            ? dashDateFormatter(
                props.value,

                {
                  getDate:
                    props.mode === undefined ||
                    props.mode == 'date' ||
                    props.mode == 'datetime',
                  getTime: props.mode == 'time' || props.mode == 'datetime',
                  dateFormat: 'yyyy-mm-dd',
                }
              )
            : props.title || props.label || null
        }
        textView
        disabled={props.disabled || formContext.disabled}
        loading={props.loading || formContext.loading}
        required={formContext.required}
        onClear={
          props.onClear
            ? () => {
                if (props.onClear) {
                  props.onClear(false);
                }
              }
            : undefined
        }
        label={props.label}
        title={props.title}
      ></TonalTextInput>
      {!!overall_error_message && (
        <Text
          style={{
            paddingHorizontal: 12,
            color: theme.error,
          }}
        >
          {overall_error_message}
        </Text>
      )}
    </>
  );
};
export const DatePicker = RawDatePicker;
