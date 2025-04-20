import { Loading } from '../../../LoadingFullView';
import { Modal, Portal } from '../../../Modal';
import { TonalTextInput } from '../../../UnvalidatedInputs/TonalTextInput';
import { type RulesList } from '../../../../client-validation-rules';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { useFormValidation } from '../../UseFormValidation';
import { useApi } from '../../../../hooks/api';
import { Text, TouchableOpacity, View } from 'react-native';
import { clip } from '../Autocomplete';
import { useCurrentThemeColors } from '../../../../hooks/useColorScheme';
import { Sticker } from '../../../Sticker';

type BaseComboboxProps = {
  title?: string;
  label?: string;
  rules?: RulesList;
  id?: string;
  value: string | null;
  disabled?: boolean;
  loading?: boolean;
  onTextChange: (text: string | null) => void;
  onClear?: (mountedClear: boolean) => void;
  placeholder?: string;
  testID?: string;
};

type UnknownUrlApiComboboxProps = {
  type: 'unknownApi';
  url: string;
  body?: any;
  apiSelector: (data: any) => any[];
  textExtractor: (item: any) => string;
};

type DataComboboxProps<Data extends any[]> = {
  type: 'dada';
  data: Data;
  onRefetch?: () => Promise<void> | void;
  fetchOnMounted?: boolean;
  textExtractor: (item: Data extends (infer R)[] ? R : unknown) => string;
};

type ComboboxProps<Data extends any[]> = BaseComboboxProps &
  (DataComboboxProps<Data> | UnknownUrlApiComboboxProps);

const mountedFetchHistory = {} as {
  [key: string]: true;
};

const UnreferencedCombobox = <Data extends any[]>(
  props: ComboboxProps<Data>
) => {
  const { api } = useApi();
  const theme = useCurrentThemeColors();

  const formContext = useFormValidation({
    rules: props.rules,
    initialValue: props.value,
    id: props.id,
    onReset: (m) => {
      if (props.onClear) {
        props.onClear(m);
      } else {
        if (m) {
          return;
        }
        props.onTextChange(null);
      }
    },
  });

  useEffect(() => {
    formContext.setValue(props.value);
  }, [props.value]);

  const [shown, setShown] = useState(false);

  const [networkErrorMessage, setNetworkErrorMessage] = useState(
    null as null | string
  );

  const [data, setData] = useState([] as any[]);
  const [loading, setLoading] = useState(false);

  const refetch = useCallback(
    (
      refetchProps: { now?: boolean; mounted_refetch: boolean } = {
        now: false,
        mounted_refetch: true,
      }
    ) => {
      (async () => {
        setLoading(true);
        setNetworkErrorMessage(null);
        try {
          if (props.type == 'dada') {
            if (props.onRefetch) {
              await props.onRefetch();
            }
          } else {
            setLastBody(JSON.stringify(props.body));
            setLastUrl(props.url);
            props.onClear
              ? props.onClear(refetchProps.mounted_refetch)
              : !refetchProps.mounted_refetch && props.onTextChange(null);
            const response = await api.post(props.url, props.body);

            const selectedData: any[] = props.apiSelector(response.data);
            setData(selectedData);
          }
        } catch (error: any) {
          setNetworkErrorMessage(error.message);
          console.log(
            'Refetch Error in Combobox titled: ',
            props.title,
            ', Error: ',
            error
          );
        }
        setLoading(false);
      })();
    },
    [
      props.type,
      props.type != 'dada' && props.url,
      props.type != 'dada' && props.body,
    ]
  );

  useEffect(() => {
    props.onClear?.(true);

    if (
      mountedFetchHistory[props.title || 'unknown'] &&
      process.env.NODE_ENV !== 'test'
    ) {
      return;
    }

    mountedFetchHistory[props.title || props.label || 'unknown'] = true;

    if (props.type == 'dada') {
      if (props.fetchOnMounted) {
        refetch({
          now: false,
          mounted_refetch: true,
        });
      }
      return;
    }

    refetch({
      now: false,
      mounted_refetch: true,
    });
  }, []);

  const renderItem = useCallback(
    ({ item }: any) => {
      return (
        <View
          style={{
            paddingHorizontal: 8,
            height: 38,
            borderBottomWidth: 1,
            borderBottomColor: '#00000022',
          }}
        >
          <TouchableOpacity
            onPress={() => {
              props.onTextChange(item);
              setShown(false);
            }}
          >
            <View
              style={{
                paddingVertical: 8,
              }}
            >
              <Text
                style={{
                  color:
                    props.value && props.value == item
                      ? theme.primary
                      : theme.primary + 'aa',
                }}
              >
                {item}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    },
    [props.value, props.onTextChange]
  );

  const [dataStrings, setDataStrings] = useState([] as string[]);
  useEffect(() => {
    const dataSource = props.type == 'dada' ? props.data : data;
    setDataStrings([
      ...new Set(
        dataSource
          .map((item) => {
            return clip(props.textExtractor(item).toLowerCase(), 50);
          })
          .filter((e) => !!e)
      ),
    ]);
  }, [
    props.textExtractor,
    props.type,
    props.type === 'dada' && props.data,
    data,
  ]);
  const [filteredStrings, setFilteredStrings] = useState([] as string[]);
  useEffect(() => {
    const s = props.value?.toLowerCase();
    if (s) {
      setFilteredStrings(
        dataStrings.filter((value) => {
          return value.includes(s);
        })
      );
    } else {
      setFilteredStrings(dataStrings);
    }
  }, [dataStrings, props.value]);

  const [timeout, settimeout] = useState(null as NodeJS.Timeout | null);
  const [lastBody, setLastBody] = useState('' as string);
  const [lastUrl, setLastUrl] = useState('' as string);
  useEffect(() => {
    if (props.type != 'dada' && process.env.NODE_ENV !== 'test') {
      const bodyJson = JSON.stringify(props.body);
      if (bodyJson == lastBody && props.url == lastUrl) {
        return;
      }
      timeout && clearTimeout(timeout);
      settimeout(setTimeout(refetch, 300));
    }
  }, [props.type != 'dada' && props.url, props.type != 'dada' && props.body]);
  const list = useMemo(() => {
    return (
      <>
        {/* <FlatList
                contentContainerStyle={{

                    paddingBottom: 8,
                }}
                data={filteredStrings}
                renderItem={renderItem}
                keyExtractor={(item, index) => String(index)}
            ></FlatList> */}

        <FlashList
          estimatedItemSize={40}
          contentContainerStyle={{
            paddingBottom: 8,
          }}
          data={filteredStrings}
          renderItem={renderItem}
          keyExtractor={(_, index) => String(index)}
        ></FlashList>
      </>
    );
  }, [filteredStrings]);
  const modalContent = useMemo(() => {
    return (
      <View
        style={{
          height: '100%',
        }}
      >
        <View>
          <TonalTextInput
            errorMessage={formContext.validationErrorMessage || undefined}
            containerStyle={{
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }}
            placeholder={props.placeholder}
            onChangeText={(v) => {
              props.onTextChange(v);
            }}
            value={props.value || ''}
            loading={loading || formContext.loading}
          ></TonalTextInput>
        </View>
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 4,
            gap: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <Text>{props.title || props.label}</Text>
          </View>
          <View>
            {(props.type != 'dada' || props.onRefetch) && (
              <TouchableOpacity
                onPress={() => {
                  refetch({
                    now: true,
                    mounted_refetch: false,
                  });
                }}
              >
                <Text>Reload</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View
          style={{
            height: '100%',
            width: '100%',
            overflow: 'hidden',
          }}
        >
          {loading ? (
            <>
              <Loading></Loading>
            </>
          ) : networkErrorMessage ? (
            <>
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  alignItems: 'center',
                  top: '32%',
                }}
              >
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: theme.onSurface + '77',
                    }}
                  >
                    There is no data available
                  </Text>
                </View>
              </View>
            </>
          ) : !filteredStrings.length ? (
            <>
              <Sticker
                StickerProps={{
                  width: 100,
                  height: 100,
                }}
                title="There is no Data"
                text="There is no Data available to chose from"
              ></Sticker>
            </>
          ) : (
            list
          )}
        </View>
      </View>
    );
  }, [
    formContext.validationErrorMessage,
    props.placeholder,
    props.onTextChange,
    props.value,
    loading,
    formContext.loading,
    props.title,
    props.type != 'dada' || props.onRefetch,
    networkErrorMessage,
    !!filteredStrings.length,
  ]);

  const modal = (
    <Portal>
      <Modal
        visible={shown && !formContext.disabled}
        dismissible
        onDismiss={() => {
          setShown(false);
        }}
        style={{
          alignItems: 'center',
        }}
        contentContainerStyle={{
          backgroundColor: theme.background,
          height: '78%',
          width: '90%',
          overflow: 'hidden',
          borderRadius: 22,
        }}
      >
        {modalContent}
      </Modal>
    </Portal>
  );

  return (
    <>
      {modal}
      <TonalTextInput
        onChangeText={() => {}}
        textView
        readOnly
        onPress={() => {
          if (!shown) {
            setShown(true);
          }
        }}
        disabled={props.disabled || formContext.disabled}
        loading={loading || props.loading || formContext.loading}
        required={formContext.required}
        errorMessage={formContext.validationErrorMessage || undefined}
        value={props.value || ''}
        title={props.title}
        label={props.label}
        placeholder={props.placeholder}
        testID={props.testID}
        onClear={props.onClear ? () => props.onClear?.(true) : undefined}
      ></TonalTextInput>
    </>
  );
};

export const Combobox = memo(
  UnreferencedCombobox
) as typeof UnreferencedCombobox;
