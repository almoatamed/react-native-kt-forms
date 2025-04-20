import { memo, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  TextInput,
  type TextInputProps,
  TouchableOpacity,
  type ViewStyle,
  type ViewProps,
  Pressable,
} from 'react-native';
import { staticColors } from '../../../constants/colors';
import { ThemedText } from '../../ThemedText';
import { FieldsChips } from '../../FieldsChips';
import { ThemedView } from '../../ThemedView';
import { useCurrentThemeColors } from '../../../hooks/useColorScheme';

export type Merge<T, U> = T & Omit<U, keyof T>;

type OpaqueColorValue = symbol & { __TYPE__: 'Color' };
export type ColorValue = string | OpaqueColorValue;

export type NumberProp = string | number;
export interface SvgProps extends ViewProps {
  width?: NumberProp;
  height?: NumberProp;
  viewBox?: string;
  preserveAspectRatio?: string;
  color?: ColorValue;
  title?: string;
}

type TonalTextInputProps = Omit<
  Merge<
    {
      errorMessage?: string;
      id?: string;
      required?: boolean;
      right?: (props: { iconProps: SvgProps }) => React.JSX.Element;
      left?: (props: { iconProps: SvgProps }) => React.JSX.Element;
      variant?: 'underlined' | 'outlined' | 'filled';
      label?: string;
      title?: string;
      textView?: boolean;
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
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [hide, setHide] = useState(true);
  const labelCondition = useMemo(() => {
    return !!props.label && !!props.value;
  }, [props.label, props.value]);

  const theme = useCurrentThemeColors();

  const primary = theme?.primary;
  const onPrimary = theme?.onPrimary;

  const variants = useVariants({
    isFocused,
    multiline: props.multiline || false,
    labelCondition,
    onPrimary,
    primary,
  });
  const variant = variants[props.variant || 'outlined'];

  const isDisabled = props.disabled;

  const RightIcon = () => {
    return (
      <>
        {(!!props.loading && (
          <ActivityIndicator
            size={'small'}
            animating={true}
            style={{
              padding: 10,
            }}
            color={isDisabled ? staticColors.disabled : primary}
          />
        )) || (
          <>
            {props.value && (
              <>
                <TouchableOpacity
                  onPress={(_) => {
                    if (props.onClear) {
                      props.onClear?.(false);
                    } else {
                      props.onChangeText(null);
                    }
                  }}
                  disabled={isDisabled}
                >
                  <ThemedText
                    style={{
                      color: onPrimary + '77',
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
                  onPress={(_) => {
                    setHide((prev) => {
                      return !prev;
                    });
                  }}
                  disabled={isDisabled}
                >
                  <ThemedText
                    style={{
                      color: onPrimary + '77',
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
          color: isDisabled ? staticColors.disabled : primary,
          width: 20,
          height: 20,
          style: {
            padding: 10,
          },
        },
      })}
    </>
  );

  if (props.textView) {
    if (Array.isArray(props.value)) {
      const items = props.value.map((i) => {
        return {
          label: '',
          value: i,
        };
      });
      return (
        <ThemedView>
          {props.title && (
            <ThemedView
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              <ThemedText>
                {props.title}{' '}
                {!!props.required ? (
                  <>
                    <ThemedText style={{ color: 'red' }}>*</ThemedText>
                  </>
                ) : (
                  ''
                )}
              </ThemedText>
            </ThemedView>
          )}
          <ThemedView
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: props.disabled
                  ? theme.secondary
                  : theme.secondaryContainer,
                paddingHorizontal: 10,
                overflow: 'hidden',
                gap: 4,
                borderRadius: 12,
                padding: 8,
                borderColor: props.disabled
                  ? theme.secondary
                  : theme.onSecondaryContainer,
              },
              props.containerStyle,
            ]}
          >
            <Pressable
              style={{
                height: 48,
                width: 35,
                flex: 0,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                props.onPress?.();
              }}
              testID={props.testID}
            >
              <LeftIcon></LeftIcon>
            </Pressable>
            <ThemedView
              style={{
                flex: 1,
              }}
            >
              {!props.value?.length ? (
                <ThemedText
                  onPress={() => {
                    props.onPress?.();
                  }}
                  disabled={props.disabled}
                  style={{
                    flex: 1,
                    minHeight: 43,
                    paddingTop: 10,
                    paddingRight: 10,
                    paddingBottom: 10,
                    paddingLeft: 0,
                    width: '100%',
                    backgroundColor: props.disabled
                      ? 'transparent'
                      : theme.secondaryContainer,
                    color: props.disabled
                      ? theme.onSecondary
                      : theme.onSecondaryContainer,
                  }}
                >
                  {props.placeholder || props.label || props.title || ' '}
                </ThemedText>
              ) : (
                <>
                  <FieldsChips
                    oneRow
                    style={{
                      color: props.disabled
                        ? theme.secondary
                        : theme.onSecondaryContainer,
                    }}
                    containerStyle={{
                      alignItems: 'center',
                      paddingVertical: 12,
                      height: '100%',
                      overflow: 'scroll',
                    }}
                    fields={items}
                    clip={4}
                  ></FieldsChips>
                </>
              )}
            </ThemedView>
            <ThemedView
              style={{
                flex: 0,
              }}
            >
              <RightIcon />
            </ThemedView>
          </ThemedView>
          {/* </ThemedView> */}
          {props.errorMessage && (
            <ThemedText
              style={{
                paddingHorizontal: 12,
                color: theme.error,
              }}
              testID={
                props.testID === undefined ? undefined : `${props.testID}-error`
              }
            >
              {props.errorMessage}
            </ThemedText>
          )}
        </ThemedView>
      );
    } else {
      return (
        <ThemedView>
          {props.title && (
            <ThemedView
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              <ThemedText>
                {props.title}{' '}
                {!!props.required ? (
                  <>
                    <ThemedText style={{ color: 'red' }}>*</ThemedText>
                  </>
                ) : (
                  ''
                )}
              </ThemedText>
            </ThemedView>
          )}
          <ThemedView
            onPress={() => {
              props.onPress?.();
            }}
            disabled={props.disabled}
            testID={props.testID}
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: props.disabled
                  ? theme.secondary
                  : theme.secondaryContainer,
                paddingHorizontal: 10,
                gap: 8,
                borderRadius: 12,
                padding: 4,
                minHeight: 50,
                borderColor: props.disabled
                  ? theme.secondary
                  : theme.onSecondaryContainer,
              },
              props.containerStyle,
            ]}
          >
            <LeftIcon></LeftIcon>
            {!props.value ? (
              <ThemedText
                onPress={() => {
                  props.onPress?.();
                }}
                disabled={props.disabled}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',

                  flex: 1,
                  paddingTop: 10,
                  paddingRight: 10,
                  paddingBottom: 10,
                  paddingLeft: 0,
                  verticalAlign: 'middle',
                }}
              >
                {props.placeholder || props.label || props.title || ' '}
              </ThemedText>
            ) : (
              <ThemedView
                style={{
                  flex: 1,
                  paddingRight: 10,
                  paddingLeft: 0,
                  justifyContent: 'center',
                  // flexDirection: "row",
                  width: '100%',
                  backgroundColor: props.disabled
                    ? 'transparent'
                    : theme.secondaryContainer,
                }}
              >
                {!props.title && props.label && (
                  <ThemedText
                    onPress={() => {
                      props.onPress?.();
                    }}
                    disabled={props.disabled}
                    style={{
                      width: '100%',
                      fontSize: 9,
                      backgroundColor: props.disabled
                        ? 'transparent'
                        : theme.secondaryContainer,
                      color: props.disabled
                        ? theme.onSecondary
                        : theme.onSecondaryContainer + 'aa',
                    }}
                  >
                    {props.label || ' '}
                    {'\n'}
                  </ThemedText>
                )}
                <ThemedText
                  onPress={() => {
                    props.onPress?.();
                  }}
                  disabled={props.disabled}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',

                    width: '100%',
                    backgroundColor: props.disabled
                      ? 'transparent'
                      : theme.secondaryContainer,
                    color: props.disabled
                      ? theme.onSecondary
                      : theme.onSecondaryContainer,
                  }}
                >
                  {props.value}
                </ThemedText>
              </ThemedView>
            )}
            <RightIcon />
          </ThemedView>
          {props.errorMessage && (
            <ThemedText
              style={{
                paddingHorizontal: 12,
                color: theme.error,
              }}
              testID={
                props.testID === undefined ? undefined : `${props.testID}-error`
              }
            >
              {props.errorMessage}
            </ThemedText>
          )}
        </ThemedView>
      );
    }
  }

  const Input = (
    <ThemedView
      style={[
        {
          ...variant.topWrapperStyle,
        },
        props.containerStyle,
      ]}
    >
      <LeftIcon></LeftIcon>
      <ThemedView
        style={{
          ...variant.inputWrapperStyle,
        }}
      >
        <TextInput
          {...(props as any)}
          readOnly={isDisabled}
          ref={inputRef}
          style={[
            {
              outline: 'none',

              color: isDisabled
                ? staticColors.onDisabled
                : staticColors.onDisabledLightSurface,
            },
          ]}
          secureTextEntry={props.textContentType === 'password' && hide}
          placeholder={props.placeholder || props.label || props.title || ''}
          defaultValue={props.defaultValue}
          value={props.value === null ? '' : props.value}
          cursorColor={primary}
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
            props.onSubmitEditing?.(...args);
          }}
          testID={props.testID}
        ></TextInput>
      </ThemedView>
      <RightIcon />
    </ThemedView>
  );

  return (
    <ThemedView style={{ gap: 4 }}>
      {!!props.title && (
        <ThemedView
          style={{
            paddingHorizontal: 10,
            paddingVertical: 4,
          }}
        >
          <ThemedText>{props.title}</ThemedText>
          {!!props.required ? (
            <>
              <ThemedText style={{ color: 'red' }}> *</ThemedText>
            </>
          ) : (
            ''
          )}
        </ThemedView>
      )}
      {Input}
    </ThemedView>
  );
};

const useVariants = ({
  isFocused,
  labelCondition,
  multiline,
  onPrimary,
  primary,
}: {
  isFocused: boolean;
  multiline: boolean;
  primary: string;
  onPrimary: string;
  labelCondition: boolean;
}) => {
  return {
    filled: {
      placeHolderColor: onPrimary + '77',
      topWrapperStyle: {
        borderColor: isFocused ? primary : staticColors.disabled,
        alignItems: multiline ? undefined : 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
        backgroundColor: primary + '66',
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
      placeHolderColor: onPrimary + '77',
      topWrapperStyle: {
        borderColor: isFocused ? primary : staticColors.disabled,
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
      placeHolderColor: onPrimary + '77',
      topWrapperStyle: {
        borderBottomColor: isFocused ? primary : staticColors.disabled,
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
