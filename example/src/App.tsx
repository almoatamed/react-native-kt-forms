import {
  Form,
  FormProvider,
  rules,
  useCurrentThemeColors,
} from '../../src/index';
import { Text, View } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [name, setName] = useState(null as string | null);
  const [valid, setValid] = useState(false);
  const theme = useCurrentThemeColors();

  return (
    <FormProvider>
      <Text>{valid}</Text>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: theme.surface,
          justifyContent: 'center',
        }}
      >
        <Form
          onValidationStateChange={(v) => {
            setValid(v);
          }}
        >
          <Form.TonalTextInput
            rules={[rules.required('Name')]}
            title="name"
            onChangeText={(text) => {
              setName(text);
            }}
            value={name}
          ></Form.TonalTextInput>
        </Form>
      </View>
    </FormProvider>
  );
}
