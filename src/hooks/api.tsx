import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import axios, {
  type AxiosHeaderValue,
  type AxiosInstance,
  type HeadersDefaults,
} from 'axios';

type Theme = {
  primary: string;
  surfaceTint?: string;
  onPrimary: string;
  primaryContainer?: string;
  onPrimaryContainer?: string;
  secondary?: string;
  onSecondary?: string;
  secondaryContainer?: string;
  onSecondaryContainer?: string;
  tertiary?: string;
  onTertiary?: string;
  tertiaryContainer?: string;
  onTertiaryContainer?: string;
  error?: string;
  onError?: string;
  errorContainer?: string;
  onErrorContainer?: string;
  background?: string;
  onBackground?: string;
  surface: string;
  onSurface: string;
  surfaceVariant?: string;
  onSurfaceVariant?: string;
  outline?: string;
  outlineVariant?: string;
  shadow?: string;
  scrim?: string;
  inverseSurface?: string;
  inverseOnSurface?: string;
  inversePrimary?: string;
  primaryFixed?: string;
  onPrimaryFixed?: string;
  primaryFixedDim?: string;
  onPrimaryFixedVariant?: string;
  secondaryFixed?: string;
  onSecondaryFixed?: string;
  secondaryFixedDim?: string;
  onSecondaryFixedVariant?: string;
  tertiaryFixed?: string;
  onTertiaryFixed?: string;
  tertiaryFixedDim?: string;
  onTertiaryFixedVariant?: string;
  surfaceDim?: string;
  surfaceBright?: string;
  surfaceContainerLowest?: string;
  surfaceContainerLow?: string;
  surfaceContainer?: string;
  surfaceContainerHigh?: string;
  surfaceContainerHighest?: string;
};
const apiContext = createContext<{
  api: AxiosInstance;
  theme?: Theme;
}>({
  api: axios.create(),
  theme: undefined,
});

export const useApi = () => {
  return useContext(apiContext);
};

export const ApiProvider = (
  props: PropsWithChildren & {
    baseUrl?: string;
    headers?: HeadersDefaults & {
      [key: string]: AxiosHeaderValue;
    };
    theme?: Theme;
  }
) => {
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: props.baseUrl || process.env.EXPO_PUBLIC_BASE_URL,
      timeout: 120e3,
    });
    return instance;
  }, []);

  useEffect(() => {
    api.defaults.headers = {
      ...api.defaults.headers,
      ...(props.headers || {}),
    };
    api.defaults.baseURL = props.baseUrl || process.env.EXPO_PUBLIC_BASE_URL;
  }, [props.headers, props.baseUrl]);

  return (
    <apiContext.Provider
      value={{
        api,
        theme: props.theme,
      }}
    >
      {props.children}
    </apiContext.Provider>
  );
};
