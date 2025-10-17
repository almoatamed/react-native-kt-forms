import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  type StyleProp,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';

import { Modal, Portal } from '../../../Modal';
import { Button } from '../../../Button';
import { TonalTextInput } from '../../../InvalidatedInputs/TonalTextInput';
import { type RulesList } from '../../../../client-validation-rules';
import { FlashList } from '@shopify/flash-list';
import { ActivityIndicator } from 'react-native';
import { useFormValidation } from '../../UseFormValidation';
import { useApi } from '../../../../hooks/api';
import { staticColors } from '../../../../constants/colors';
import { useCurrentThemeColors } from '../../../../hooks/useColorScheme';

export function clip(text: string, max_length: number): string {
  if (!text) {
    return '';
  }
  if (text.length > max_length) {
    return `${text.slice(0, max_length - 3)}...`;
  } else {
    return text;
  }
}

export type BaseAutocompleteProps = {
  onClear: (mounted_clear: boolean) => void;
  label?: string;
  id?: string;
  disabled?: boolean;
  loading?: boolean;
  rules?: RulesList;
  title?: string;
  errorMessage?: string;
  testID?: string;
};

export type DataAutoCompleteProps<Data extends any[]> = {
  type: 'data';
  onLoad?: (data: Data, error?: any) => Promise<void> | void;
  data: Data;
  text: (item: Data extends (infer R)[] ? R : any) => string;
  onRefetch?: (now: boolean, hide: () => void) => any;
  multiple?: false;
  selectedItem: null | Data extends (infer R)[] ? R : any;
  onChose: (item: Data extends (infer R)[] ? R : any) => void;
};
export type MultipleDataAutoCompleteProps<Data extends any[]> = {
  type: 'data';
  data: Data;
  text: (item: Data extends (infer R)[] ? R : any) => string;
  onRefetch?: (now: boolean, hide: () => void) => any;
  onLoad?: (data: Data, error?: any) => Promise<void> | void;
  multiple: true;
  selectedItem: null | Data;
  onChose: (values: Data) => void;
};

export type UnknownUrlApiAutoCompleteProps = {
  type: 'unknownApi';
  url: string;
  body?: any;
  apiSelector: (data: any) => any[];
  text: (item: any) => string;
  onLoad?: (data: any[], error?: any) => Promise<void> | void;
  multiple?: false;
  selectedItem: null | any;
  onChose: (item: any) => void;
};

export type MultipleUnknownUrlApiAutoCompleteProps = {
  type: 'unknownApi';
  url: string;
  body?: any;

  apiSelector: (data: any) => any[];
  text: (item: any) => string;
  multiple: true;
  onLoad?: (data: any[], error?: any) => Promise<void> | void;
  selectedItem: null | any[];
  onChose: (values: any[]) => void;
};
export type AutoCompleteProps<Data extends any[]> = BaseAutocompleteProps &
  (
    | UnknownUrlApiAutoCompleteProps
    | MultipleUnknownUrlApiAutoCompleteProps
    | DataAutoCompleteProps<Data>
    | MultipleDataAutoCompleteProps<Data>
  );

const fetched_initially = {} as {
  [key: string]: true | undefined;
};
const RawAutocomplete = <Data extends any[]>(
  props: AutoCompleteProps<Data>
) => {
  const { api } = useApi();
  const theme = useCurrentThemeColors();
  const formContext = useFormValidation({
    rules: props.rules,
    initialValue: props.selectedItem,
    id: props.id,
    onReset: (m) => {
      props.onClear(m);
    },
  });
  useEffect(() => {
    formContext.setValue(props.selectedItem);
  }, [props.selectedItem]);

  const text = useCallback(
    (item: any) => {
      return !item ? `` : `${props.text(item)}`;
    },
    [props.text]
  );

  const surface = theme?.surface || undefined;
  const onSurface = theme?.onSurface || undefined;
  const primary = theme?.primary;

  const [isAutoCompleteModalShown, setIsAutoCompleteModalShown] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const defaultModalContainerStyle: StyleProp<ViewStyle> = {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: surface,
    width: Dimensions.get('window').width > 720 ? 200 : '90%',
  };

  const defaultModalCoverStyle: StyleProp<ViewStyle> = {
    alignItems: 'center',
  };

  const defaultModalStyle = {
    defaultModalCoverStyle,
    defaultModalContainerStyle,
  };

  const isItemSelected = useCallback(
    (item: any) => {
      if (props.multiple) {
        const foundItem = props.selectedItem?.find((selectedItem) => {
          return text(selectedItem) == text(item);
        });
        return !!foundItem;
      } else {
        return text(props.selectedItem) == text(item);
      }
    },
    [text, props.selectedItem, props.multiple]
  );

  const [data, setData] = useState(null as any[] | null);
  const refetch = useCallback(
    (now = false) => {
      (async (now = false) => {
        if (props.type == 'data' && props.onRefetch) {
          if (!now && fetched_initially[props.label || props.title || '']) {
            return;
          }
          fetched_initially[props.label || props.title || ''] = true;
          setLoading(true);
          try {
            await props.onRefetch?.(now, () => {
              setIsAutoCompleteModalShown(false);
            });
            props.onLoad?.(props.data, null);
          } catch (error) {
            console.log('Data Autocomplete On Refetch Error', error);
            props.onLoad?.([] as any, error);
          }

          setLoading(false);
        } else if (props.type === undefined || props.type == 'unknownApi') {
          setNetworkErrorMessage(null);
          setLoading(true);
          try {
            const newData = props.apiSelector?.(
              (await api.post(props.url, props.body)).data
            );
            setData(newData || []);
            props.onLoad?.(newData, null);
          } catch (error: any) {
            setNetworkErrorMessage(
              error?.message || 'something wrong occurred'
            );
            props.onLoad?.([], error);
          }
          setLoading(false);
        }
      })(now);
    },
    [(props as any).url, (props as any).data, (props as any).apiSelector]
  );
  useEffect(() => {
    props.onClear(true);
    refetch(false);
  }, [(props as any).url]);

  const [filteredData, setFilteredData] = useState([] as any[]);
  useEffect(() => {
    const dataSource = props.type === 'data' ? props.data : data;
    const s = searchText;
    if (s) {
      setFilteredData(
        dataSource?.filter?.((item) => {
          return text(item).toLowerCase().includes(searchText.toLowerCase());
        }) || []
      );
    } else {
      setFilteredData(dataSource || []);
    }
  }, [data, (props as any).data, searchText]);

  const renderItem = useCallback(
    ({ item }: any) => {
      return (
        <View
          style={{
            paddingHorizontal: 8,
            minHeight: 38,
            borderBottomWidth: 1,
            borderBottomColor: '#00000022',
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (props.multiple === true) {
                const values = [...(props.selectedItem || [])];
                if (
                  !values.find((values_item) => {
                    return props.text(item) == props.text(values_item);
                  })
                ) {
                  props.onChose([...values, item] as any);
                } else {
                  props.onChose(
                    values.filter((i) => {
                      return text(i) != text(item);
                    }) as any
                  );
                }
              } else {
                props.onChose(item);
                setIsAutoCompleteModalShown(false);
              }
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
                    props.selectedItem && isItemSelected(item)
                      ? primary
                      : primary + 'aa',
                }}
              >
                {clip(text(item), 100)}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    },
    [props.text, props.selectedItem, props.onChose]
  );

  const [networkErrorMessage, setNetworkErrorMessage] = useState(
    null as null | string
  );

  const overall_error_message = useMemo(
    () =>
      networkErrorMessage ||
      props.errorMessage ||
      formContext.validationErrorMessage,
    [
      networkErrorMessage,
      props.errorMessage,
      formContext.validationErrorMessage,
    ]
  );
  const list = useMemo(() => {
    return (
      <FlashList
        estimatedItemSize={38}
        contentContainerStyle={{
          paddingBottom: 8,
        }}
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(index) => String(index)}
      ></FlashList>
    );
  }, [filteredData, props.selectedItem]);
  const modalContentGuts = useMemo(() => {
    if (loading) {
      return (
        <View
          style={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ActivityIndicator size={'large'} animating={true} color={primary} />
        </View>
      );
    } else if (networkErrorMessage) {
      return (
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
                  color: onSurface + '77',
                  textAlign: 'center',
                  paddingHorizontal: 8,
                }}
              >
                {networkErrorMessage}
              </Text>
            </View>
          </View>
        </>
      );
    } else if (!!filteredData?.length) {
      return list;
    } else {
      return (
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
                  color: onSurface + '77',
                }}
              >
                There is no data available
              </Text>
            </View>
          </View>
        </>
      );
    }
  }, [list, loading, networkErrorMessage, !!filteredData?.length]);
  const modalContent = useMemo(() => {
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <TonalTextInput
          readOnly
          textView
          containerStyle={{
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
          }}
          label={props.title}
          placeholder="search"
          disabled={loading}
          value={searchText}
          onChangeText={(t) => {
            setSearchText(t || '');
          }}
          left={() => {
            return (
              <>
                {(() => {
                  if (loading) {
                    return (
                      <ActivityIndicator
                        size={'small'}
                        animating={true}
                        color={primary}
                      />
                    );
                  } else {
                    return undefined;
                  }
                })()}
              </>
            );
          }}
        ></TonalTextInput>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderBottomWidth: 1,
            borderBottomColor: '#00000022',
          }}
        >
          <Text>{props.label}</Text>
          {((props.type !== 'data' && props.url) ||
            (props.type == 'data' && !!props.onRefetch)) && (
            <Button
              variant="text"
              type="primary"
              onPress={() => refetch(true)}
              loading={loading}
              disabled={loading}
              label="Reload"
            ></Button>
          )}
        </View>
        <View
          style={{
            width: '100%',
            height: 'auto',
            flex: 1,
          }}
        >
          {modalContentGuts}
        </View>
      </View>
    );
  }, [
    networkErrorMessage,
    props.type,
    props.type == 'data' && !!props.onRefetch,
    modalContentGuts,
  ]);

  const AutocompleteDialog = (
    <Portal>
      <Modal
        visible={!!isAutoCompleteModalShown && !formContext.disabled}
        onDismiss={() => {
          setIsAutoCompleteModalShown(false);
        }}
        dismissibleBackButton={true}
        contentContainerStyle={[
          defaultModalStyle.defaultModalContainerStyle,
          {
            height: '85%',
          },
        ]}
        style={[defaultModalStyle.defaultModalCoverStyle]}
      >
        {modalContent}
      </Modal>
    </Portal>
  );

  return (
    <View>
      {AutocompleteDialog}
      <TonalTextInput
        onChangeText={() => {}}
        onPress={() => {
          setIsAutoCompleteModalShown(true);
        }}
        value={
          props.multiple
            ? props.selectedItem?.map((t) => text(t)).join(', ') || null
            : text(props.selectedItem)
        }
        required={formContext.required}
        disabled={props.disabled || formContext.disabled}
        loading={loading || props.loading || formContext.loading}
        onClear={() => {
          props.onClear(false);
        }}
        label={props.label}
        title={props.title}
        testID={props.testID}
      ></TonalTextInput>
      {overall_error_message && (
        <Text
          style={{
            paddingHorizontal: 12,
            color: staticColors.error,
          }}
        >
          {overall_error_message}
        </Text>
      )}
    </View>
  );
};

export const Autocomplete = memo(RawAutocomplete) as typeof RawAutocomplete;
