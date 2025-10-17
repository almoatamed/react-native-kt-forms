import {
  memo,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  TextInput,
  type TextInputProps,
  TouchableOpacity,
  type ViewStyle,
} from 'react-native';
import { useFormValidation } from '../../UseFormValidation';
import { ThemedText } from '../../../ThemedText';
import { ThemedView } from '../../../ThemedView';
import type { Merge } from '../../../../common';
import type { SvgProps } from '../../../InvalidatedInputs/TonalTextInput';
import type { RulesList } from '../../../../client-validation-rules';
import { useCurrentThemeColors } from '../../../../hooks/useColorScheme';

const Text = ThemedText;
const View = ThemedView;

type TonalTextInputProps = Omit<
  Merge<
    {
      errorMessage?: string;
      id?: string;
      variant?: 'underlined' | 'outlined' | 'filled';
      right?: (props: { iconProps: SvgProps }) => React.JSX.Element;
      left?: (props: { iconProps: SvgProps }) => ReactNode;
      label?: string;
      title?: string;
      rules?: RulesList;
      onPress?: Function;
      containerStyle?: ViewStyle;
      disabled?: boolean;
      loading?: boolean;
      onClear?: (mounted_clear: boolean) => void;
      onChangeText: (text: string | null) => void;
      testID?: string;
    },
    TextInputProps
  >,
  'value'
> & { value: string | null; dynamicRules?: boolean };

export const RawTonalTextInput = (props: TonalTextInputProps) => {
  const theme = useCurrentThemeColors();
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [hide, setHide] = useState(true);

  const formContext = useFormValidation({
    id: props.id,
    rules: props.rules,
    dynamicRules: props.dynamicRules,
    initialValue: props.value,
    onReset: (mountedReset) => {
      if (props.onClear) {
        props.onClear(mountedReset);
      } else {
        if (mountedReset) {
          return;
        }
        props.onChangeText(null);
      }
    },
    onFocus() {
      (inputRef.current as any)?.focus?.();
    },
  });

  useEffect(() => {
    formContext.setValue(props.value);
  }, [props.value]);

  const labelCondition = useMemo(() => {
    return !!props.label && formContext.currentValue;
  }, [props.label, props.placeholder]);

  const variants = useVariants({
    isFocused,
    multiline: props.multiline || false,
    labelCondition,
  });
  const variant = variants[props.variant || 'outlined'];

  const overallError = useMemo(() => {
    return props.errorMessage || formContext.validationErrorMessage;
  }, [props.errorMessage, formContext.validationErrorMessage]);

  const isDisabled = props.disabled || formContext.disabled;

  const RightIcon = () => {
    return (
      <>
        {props.right?.({
          iconProps: {
            color: isDisabled ? theme.secondary : theme.primary,
            width: 20,
            height: 20,
            style: {
              padding: 10,
            },
          },
        }) ||
          (!!(props.loading || formContext.loading) && (
            <ActivityIndicator
              size={'small'}
              animating={true}
              style={{
                padding: 10,
              }}
              color={isDisabled ? theme.onSecondary : theme.primary}
            />
          )) || (
            <>
              {props.value && (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      if (props.onClear) {
                        props.onClear?.(false);
                      } else {
                        props.onChangeText(null);
                      }
                    }}
                    disabled={isDisabled || formContext.disabled}
                  >
                    <ThemedText
                      style={{
                        color: theme.onPrimary + '77',
                      }}
                    >
                      Clear
                    </ThemedText>
                  </TouchableOpacity>
                </>
              )}
              {props.textContentType == 'password' && (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      setHide((prev) => {
                        return !prev;
                      });
                    }}
                    disabled={isDisabled || formContext.disabled}
                  >
                    <ThemedText
                      style={{
                        color: theme.onPrimary + '77',
                      }}
                    >
                      {hide ? 'Show' : 'hide'}
                    </ThemedText>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}
      </>
    );
  };

  const LeftIcon = () => (
    <>
      {props.left?.({
        iconProps: {
          color: isDisabled ? theme.secondary : theme.primary,
          width: 20,
          height: 20,
          style: {
            padding: 10,
          },
        },
      })}
    </>
  );

  const Input = (
    <View
      style={[
        {
          ...variant.topWrapperStyle,
        },
        props.containerStyle,
      ]}
    >
      <LeftIcon></LeftIcon>
      <View
        style={{
          ...variant.inputWrapperStyle,
        }}
      >
        <TextInput
          {...(props as any)}
          readOnly={isDisabled || formContext.disabled}
          ref={inputRef}
          style={[
            {
              outline: 'none',

              color: isDisabled
                ? theme.onSecondary
                : theme.onSecondaryContainer,
            },
          ]}
          secureTextEntry={props.textContentType === 'password' && hide}
          placeholder={props.placeholder || props.label || props.title || ''}
          defaultValue={props.defaultValue}
          value={props.value === null ? '' : props.value}
          cursorColor={theme.primary}
          onChangeText={(text) => {
            props.onChangeText(text);
          }}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          placeholderTextColor={variant.placeHolderColor}
          onSubmitEditing={(...args) => {
            formContext.moveFocusForward();
            props.onSubmitEditing?.(...args);
          }}
          testID={props.testID}
        ></TextInput>
      </View>
      <RightIcon />
    </View>
  );

  return (
    <View style={{ gap: 4 }}>
      {!!props.title && (
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 4,
          }}
        >
          <Text>
            {props.title}
            {!!formContext.required ? (
              <>
                <Text style={{ color: 'red' }}> *</Text>
              </>
            ) : (
              ''
            )}
          </Text>
        </View>
      )}
      {Input}
      {overallError && (
        <Text
          style={{
            paddingHorizontal: 12,
            color: theme.error,
          }}
          testID={
            props.testID === undefined ? undefined : `${props.testID}-error`
          }
        >
          {overallError}
        </Text>
      )}
    </View>
  );
};

const useVariants = ({
  isFocused,
  labelCondition,
  multiline,
}: {
  isFocused: boolean;
  multiline: boolean;
  labelCondition: boolean;
}) => {
  const theme = useCurrentThemeColors();
  return {
    filled: {
      placeHolderColor: theme.onSurface + '77',
      topWrapperStyle: {
        borderColor: isFocused ? theme.primary : theme.secondary,
        alignItems: multiline ? undefined : 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
        backgroundColor: theme.primaryFixed + '66',
        gap: 8,
        borderWidth: 1,
        borderRadius: 12,
      } satisfies ViewStyle,
      inputWrapperStyle: {
        flex: 1,
        paddingRight: 10,
        paddingLeft: 0,
        paddingTop: labelCondition ? 4 : 9,
        paddingBottom: 6,
        minHeight: 43,
        justifyContent: multiline ? undefined : 'center',
        width: '100%',
      } satisfies ViewStyle,
    },
    outlined: {
      placeHolderColor: theme.onSurface + '77',
      topWrapperStyle: {
        borderColor: isFocused ? theme.primary : theme.secondary,
        alignItems: multiline ? undefined : 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
        gap: 8,
        borderWidth: 1,
        borderRadius: 12,
      } satisfies ViewStyle,
      inputWrapperStyle: {
        flex: 1,
        paddingRight: 10,
        paddingLeft: 0,
        paddingTop: labelCondition ? 4 : 9,
        paddingBottom: 6,
        minHeight: 43,
        justifyContent: multiline ? undefined : 'center',
        width: '100%',
      } satisfies ViewStyle,
    },
    underlined: {
      placeHolderColor: theme.onSurface + '77',
      topWrapperStyle: {
        borderBottomColor: isFocused ? theme.primary : theme.secondary,
        alignItems: multiline ? undefined : 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
        gap: 8,
        borderBottomWidth: 1,
      } satisfies ViewStyle,
      inputWrapperStyle: {
        flex: 1,
        paddingRight: 10,
        paddingLeft: 0,
        paddingTop: labelCondition ? 4 : 9,
        paddingBottom: 6,
        minHeight: 43,
        justifyContent: multiline ? undefined : 'center',
        width: '100%',
      } satisfies ViewStyle,
    },
  };
};

export const TonalTextInput = memo(RawTonalTextInput);
