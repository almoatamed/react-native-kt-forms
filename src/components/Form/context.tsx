import { type RulesList } from '../../client-validation-rules';
import { createContext } from 'react';

export type Input = {
  validationErrorMessage: null | string;
  currentValue: any;
  rules: RulesList;
  onReset: (mountedReset: boolean) => void;
};

export type InputsMap = {
  [id: string]: Input;
};

export type RegisterInput = (
  id: string,
  options: {
    rules?: RulesList;
    value?: any;
    onReset: (mountedReset: boolean) => void;
  }
) => void;

type FormValidationContext =
  | {
      loading?: boolean;
      disabled?: boolean;
      registeredInput: RegisterInput;
      unregisterInput: (id: string) => void;
      inputs: InputsMap;
      setValue: (id: string, value: any) => void;
      validate: (
        id: string,
        validateUntouched: boolean,
        value?: string | null
      ) => {
        validationErrorMessage: null | string;
        isValid: boolean;
      };
      reset: (id: string) => void;
      validateAll: () => boolean;
      resetAll: (mountedReset: boolean) => void;
      moveFocusForward: (fromId: string) => void;
      defaultProvider: false;
      updateInputRules: (id: string, newRules: RulesList) => void;
      focused: string | null;
    }
  | {
      defaultProvider: true;
    };

const defaultFormValidationContextValue: FormValidationContext = {
  defaultProvider: true,
};

export const FormValidationContext = createContext<FormValidationContext>(
  defaultFormValidationContextValue
);

export let idCounter = 0;
export const incrementIdCounter = () => {
  idCounter += 1;
  return idCounter;
};
