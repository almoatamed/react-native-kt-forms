# react-native-kt-forms

A lightweight React Native form management and UI helpers package with validation rules, themed components, and convenient form inputs.

## Quick links

- Exports: `Form`, `rules`, `useApi`, `FormProvider`, `TonalTextInput`, `useCurrentThemeColors`, `useColorScheme`, `Button`, `ThemedText`, `ThemedView`
- Example app: see the `example/` directory for a runnable example using the library.

## Installation

Install from npm (replace with the actual package name/version if different):

```sh
npm install react-native-kt-forms
```

or

```sh
yarn add react-native-kt-forms
```

### Peer dependencies

- React and React Native (match versions used in your project)

## Basic contract

- Form: A form container component that manages input registration, validation, and submission.
- rules: A collection of client-side validation rules.
- FormProvider / ApiProvider & useApi: A provider + hook pair for API calls related to form handling (e.g., async validations, submissions).
- TonalTextInput: A text input component (also available under `components/InvalidatedInputs`) that integrates with the form system.
- ThemedView / ThemedText: Themed wrappers for View and Text that adapt to the current color scheme.
- useColorScheme, useCurrentThemeColors: Hooks to read the current color scheme and themed color palette.

## Usage examples

Below are examples taken from the `example/` app so they match the real usage in this repository.

1. Wrap your app with the form provider

```tsx
import React from 'react';
import { FormProvider } from 'react-native-kt-forms';
import App from './App';

export default function Root() {
    return (
        <FormProvider>
            <App />
        </FormProvider>
    );
}
```

1. Example form (matches `example/src/App.tsx`)

```tsx
import React, { useState } from 'react';
import { Form, FormProvider, rules, useCurrentThemeColors } from 'react-native-kt-forms';
import { Text, View } from 'react-native';

export default function App() {
    const [name, setName] = useState<string | null>(null);
    const [valid, setValid] = useState(false);
    const theme = useCurrentThemeColors();

    return (
        <FormProvider>
            <Text>{String(valid)}</Text>
            <View style={{ flex: 1, alignItems: 'center', backgroundColor: theme.surface, justifyContent: 'center' }}>
                <Form onValidationStateChange={(v) => setValid(v)}>
                    <Form.TonalTextInput
                        rules={[rules.required('Name')]}
                        title="name"
                        onChangeText={(text) => setName(text)}
                        value={name}
                    />
                </Form>
            </View>
        </FormProvider>
    );
}
```

Notes:

- `Form` exposes sub-components like `Form.TonalTextInput` (used in the example).
- `Form` supports `onValidationStateChange` (used to receive the current validity boolean).
- Validation rules are provided via the `rules` export; for example `rules.required('Name')` returns a rule that includes a friendly label.

1. Using `useApi` for custom API calls

```js
import React from 'react';
import { useApi } from 'react-native-kt-forms';

function SubmitButton() {
    const { post, loading, error } = useApi();

    const submit = async (payload) => {
        const res = await post('/submit', payload);
        return res;
    };

    return <Button onPress={() => submit({ foo: 'bar' })} title={loading ? 'Submitting...' : 'Submit'} />;
}
```

1. Theming hooks

```js
import { useColorScheme, useCurrentThemeColors } from 'react-native-kt-forms';

function ThemedExample() {
    const scheme = useColorScheme();
    const colors = useCurrentThemeColors();

    return (
        <ThemedView style={{ backgroundColor: colors.background }}>
            <ThemedText style={{ color: colors.text }}>Current scheme: {scheme}</ThemedText>
        </ThemedView>
    );
}
```

## Where to look for exact API

- `src/components/Form/index.tsx`
- `src/components/InvalidatedInputs/TonalTextInput/index.tsx`
- `src/hooks/api.tsx`
- `src/client-validation-rules/index.ts`
- `example/` folder for a working sample.

## Assumptions and notes

- This README was generated from `src/index.ts` exports and the repository layout. A few prop names and hook return values are inferred from common conventions. Please adjust examples to match the real signatures if they differ.
- The `example/` app in this repo is the best source of truth for exact usage.

## Form inputs reference

Below are usage examples for each input component provided under `src/components/Form/Inputs`. These snippets follow the components' real props as implemented in the source.

TonalTextInput

```tsx
<Form.TonalTextInput
    id="name"
    title="name"
    label="Full name"
    value={name}
    onChangeText={(text) => setName(text)}
    rules={[rules.required('Name')]}
    variant="outlined"
    placeholder="Your full name"
/>
```

Autocomplete (data-backed)

```tsx
<Autocomplete
    type="data"
    title="Choose city"
    label="City"
    data={[ 'Cairo', 'London', 'New York' ]}
    text={(item) => String(item)}
    selectedItem={selectedCity}
    onChose={(item) => setSelectedCity(item)}
    onClear={(mounted_clear) => { if (!mounted_clear) setSelectedCity(null); }}
    rules={[rules.required('City')]}
/>
```

Autocomplete (remote API)

```tsx
<Autocomplete
    type="unknownApi"
    title="Choose user"
    label="User"
    url="/api/users/search"
    body={{ q: 'search term' }}
    apiSelector={(data) => data.users}
    text={(user) => `${user.firstName} ${user.lastName}`}
    selectedItem={selectedUser}
    onChose={(u) => setSelectedUser(u)}
    onClear={() => setSelectedUser(null)}
/>
```

Combobox

```tsx
<Combobox
    title="Select option"
    label="Option"
    value={value}
    onTextChange={(v) => setValue(v)}
    data={[ 'Option A', 'Option B' ]}
    type="dada"
    textExtractor={(item) => String(item)}
    placeholder="Start typing"
    rules={[rules.required('Option')]}
/>
```

DatePicker

```tsx
<DatePicker
    title="Birthdate"
    label="Birthdate"
    shown={showDatePicker}
    onShow={() => setShowDatePicker(true)}
    onConfirm={(d) => { setBirthdate(d); setShowDatePicker(false); }}
    onCancel={() => setShowDatePicker(false)}
    value={birthdate}
    mode="date"
    rules={[rules.required('Birthdate')]}
/>
```

DateTimePicker

```tsx
<DateTimePicker
    title="Appointment"
    shown={showDateTime}
    onShow={() => setShowDateTime(true)}
    onConfirm={(d) => { setAppointment(d); setShowDateTime(false); }}
    onCancel={() => setShowDateTime(false)}
    value={appointment}
    mode="datetime"
    rules={[rules.required('Appointment')]}
/>
```

OptionsButtons

```tsx
<OptionsButtons
    label="Choose one"
    options={[{ text: 'Yes', value: 'yes' }, { text: 'No', value: 'no' }]}
    value={opt}
    onValueChange={(v) => setOpt(v)}
    rules={[rules.required('Choice')]}
/>
```

## Form provider — API headers (auth) & theme overrides

The package's provider (exported as `FormProvider` in the public API — implemented as `ApiProvider` in the source) accepts two optional props you can use to configure the underlying axios instance and to override the theme used by components.

- `headers` — an object merged into the axios defaults. Useful for adding Authorization tokens and custom headers used by your backend.
- `theme` — an object matching a subset of the internal theme keys (you can override as many or as few colors as you need). Components will use values from the provided theme when present.

Simple example — static headers and theme:

```tsx
import React from 'react';
import { FormProvider } from 'react-native-kt-forms';
import App from './App';

const customTheme = {
    // override some colors in light theme 
    light: {
        primary: '#0066FF',
        surface: '#FFFFFF',
        onPrimary: '#FFFFFF',
        onSurface: '#111111',
    }
};

export default function Root() {
    const user = useUser(); // or some state where you store your user session authentication stuff and tokens
    return (
        <FormProvider
            headers={{ Authorization: `Bearer ${user?.token}`, 'X-App-Version': '1.2.3' }}
            theme={customTheme}
        >
            <App />
        </FormProvider>
    );
}
```

Accessing the axios instance and the active theme in a component:

```tsx
import React from 'react';
import { useApi } from 'react-native-kt-forms';

function Example() {
    const { api, theme } = useApi();

    async function send() {
        const res = await api.post('/endpoint', { hello: 'world' });
        return res.data;
    }

    return (
        // render UI using theme.primary, theme.surface, etc.
        null
    );
}
```

Notes

- `headers` are merged via `api.defaults.headers = {...api.defaults.headers, ...(props.headers || {})}` so you can pass any axios header value.
- `theme` may include the small set of keys used by components (for example `primary`, `surface`, `onPrimary`, `onSurface`) — the Theme type in the source lists all supported keys; most are optional and you can override only the ones you need.
- `FormProvider` is the same implementation as `ApiProvider` in the source; it exposes `useApi()` to access the axios `api` instance and the provided `theme`.

### Base URL behavior

The provider accepts an optional `baseUrl` prop. If you don't provide `baseUrl`, the provider falls back to the environment variable `EXPO_PUBLIC_BASE_URL` (used by the example and many Expo setups).

- Precedence: `baseUrl` prop (if provided) takes priority over `EXPO_PUBLIC_BASE_URL`.
- Dynamic update: when `baseUrl` changes (you re-render `FormProvider` with a new value), the provider updates the axios instance defaults (`api.defaults.baseURL`) so subsequent requests use the new base URL.

Examples

Static environment variable (no prop):

```tsx
// set EXPO_PUBLIC_BASE_URL in your environment or .env
<FormProvider>
    <App />
</FormProvider>
```

Static prop:

```tsx
<FormProvider baseUrl="https://api.example.com">
    <App />
</FormProvider>
```

Dynamic update example (switching APIs at runtime):

```tsx
function Root() {
    const [baseUrl, setBaseUrl] = useState('https://api.example.com');

    // to switch
    // setBaseUrl('https://staging.example.com');

    return (
        <FormProvider baseUrl={baseUrl}>
            <App />
        </FormProvider>
    );
}
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
