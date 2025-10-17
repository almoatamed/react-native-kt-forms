import { memo, useEffect, useMemo } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useFormValidation } from '../../UseFormValidation';
import { ThemedText } from '../../../ThemedText';
import type { RulesList } from '../../../../client-validation-rules';
import { useCurrentThemeColors } from '../../../../hooks/useColorScheme';
import { dashDateFormatter } from '../../../../common';
import { TonalTextInput } from '../../../InvalidatedInputs/TonalTextInput';

const Text = ThemedText;

export const RawDateTimePicker = (props: {
  onShow: () => void;
  onConfirm: (date: null | Date) => void;
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
        props.onConfirm(null);
      }
    },
  });

  const theme = useCurrentThemeColors();

  useEffect(() => {
    formContext.setValue(props.value);
  }, [props.value]);

  const overall_error_message = useMemo(() => {
    return props.errorMessage || formContext.validationErrorMessage;
  }, [props.errorMessage, formContext.validationErrorMessage]);

  return (
    <>
      <DateTimePickerModal
        isVisible={props.shown}
        date={props.value || undefined}
        mode={props.mode}
        maximumDate={props.maximum}
        minimumDate={props.minimum}
        onConfirm={props.onConfirm}
        onCancel={props.onCancel}
      />
      <TonalTextInput
        onChangeText={() => {}}
        onPress={props.onShow}
        value={
          props.value
            ? dashDateFormatter(props.value, {
                getDate:
                  props.mode === undefined ||
                  props.mode == 'date' ||
                  props.mode == 'datetime',
                getTime: props.mode == 'time' || props.mode == 'datetime',
                dateFormat: 'yyyy-mm',
              })
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
      {overall_error_message && (
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
export const DateTimePicker = memo(RawDateTimePicker);
