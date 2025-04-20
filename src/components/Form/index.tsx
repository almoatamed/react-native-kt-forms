import { useCallback, useEffect, useState } from 'react';

import { Autocomplete } from './Inputs/Autocomplete';
import { Combobox } from './Inputs/Combobox';
import { DatePicker } from './Inputs/DatePicker';
import { OptionsButtons } from './Inputs/OptionsButtons';
import { TonalTextInput } from './Inputs/TonalTextInput';
import {
  FormValidationContext,
  type InputsMap,
  type RegisterInput,
} from './context';
import { createValidator, type RulesList } from '../../client-validation-rules';

export const FormValidation = (props: {
  children: React.ReactNode;
  id?: string;
  disabled?: boolean;
  loading?: boolean;
  onValidationStateChange?: (state: boolean) => void;
}) => {
  const [inputsState, setInputsState] = useState({} as InputsMap);

  const [validating, setValidating] = useState(false);
  const [validatingWithMessages, setValidatingWithMessages] = useState(false);
  const [lastIsValid, setLastIsValid] = useState(false);

  const [focused, setFocused] = useState<string | null>(null);

  const registerInput = useCallback<RegisterInput>(
    (id, options) => {
      if (!inputsState[id]) {
        setInputsState((prev) => ({
          ...prev,
          [id]: {
            currentValue: options.value || null,
            validationErrorMessage: null,
            rules: options.rules || [],
            onReset: options.onReset,
          },
        }));
      }
    },
    [inputsState]
  );

  const moveFocusForward = useCallback(
    (fromId: string) => {
      const allIds = Object.keys(inputsState);
      const fromIdx = allIds.findIndex((k) => k === fromId);

      if (fromIdx === -1 || fromIdx + 1 === allIds.length) {
        setFocused(null);
        return;
      }

      setFocused(allIds[fromIdx + 1] || null);
    },
    [inputsState]
  );

  const reset = useCallback(
    (id: string) => {
      const input = inputsState[id];
      if (input) {
        if (input.validationErrorMessage !== null) {
          setInputsState({
            ...inputsState,
            [id]: {
              ...inputsState[id]!,
              validationErrorMessage: null,
            },
          });
        }
      }
    },
    [inputsState]
  );

  const resetAll = useCallback(
    (mounted_reset: boolean) => {
      const inputsStateCopy = { ...inputsState };
      for (const id in inputsStateCopy) {
        inputsStateCopy[id]!.onReset(mounted_reset);
        inputsStateCopy[id] = {
          ...inputsStateCopy[id]!,
          validationErrorMessage: null,
        };
      }
      setInputsState(inputsStateCopy);
    },
    [inputsState]
  );

  const validate = useCallback(
    (
      id: string,
      validateUntouched: boolean,
      value?: string | null
    ): {
      isValid: boolean;
      validationErrorMessage: string | null;
    } => {
      const input = inputsState[id];
      if (input) {
        const currentValue = value === undefined ? input.currentValue : value;

        if (
          !validateUntouched &&
          currentValue === null &&
          input.validationErrorMessage === null
        ) {
          if (input.currentValue != currentValue) {
            setInputsState({
              ...inputsState,
              [id]: {
                ...input,
                currentValue: null,
                validationErrorMessage: null,
              },
            });
          }
          return {
            validationErrorMessage: null,
            isValid: true,
          };
        }
        if (input.rules?.length) {
          const validator = createValidator(
            {
              field: input.rules,
            },
            inputsState
          );
          const result = validator({
            field: currentValue,
          });
          console.log('validation result', result);

          if (result.field) {
            if (
              input.validationErrorMessage != result.field ||
              input.currentValue != currentValue
            ) {
              setInputsState({
                ...inputsState,
                [id]: {
                  ...input,
                  currentValue: currentValue,
                  validationErrorMessage: result.field,
                },
              });
            }
          } else {
            if (
              input.validationErrorMessage ||
              input.currentValue != currentValue
            ) {
              setInputsState({
                ...inputsState,
                [id]: {
                  ...input,
                  currentValue: currentValue,
                  validationErrorMessage: null,
                },
              });
            }
          }
          return {
            isValid: !result.field,
            validationErrorMessage: result.field || null,
          };
        } else {
          return {
            isValid: true,
            validationErrorMessage: null,
          };
        }
      } else {
        return {
          isValid: false,
          validationErrorMessage: 'input id not found',
        };
      }
    },
    [inputsState]
  );

  const setValue = useCallback<(id: string, value: any) => void>(
    (id, value) => {
      const input = inputsState[id];
      console.log('input', id, input);
      if (input && input.currentValue != value) {
        console.log('setting value', value);

        validate(id, true, value);
      }
    },
    [inputsState, validate]
  );

  const unregisterInput = useCallback(
    (targetId: string) => {
      if (!inputsState[targetId]) {
        return;
      }
      const newInputs = {} as InputsMap;
      for (const id in inputsState) {
        if (id == targetId) {
          continue;
        }
        newInputs[id] = inputsState[id]!;
      }

      setInputsState(newInputs);
    },
    [inputsState]
  );

  const updateInputRules = useCallback(
    (id: string, rules: RulesList) => {
      const input = inputsState[id];
      if (input) {
        setInputsState({
          ...inputsState,
          [id]: {
            ...input,
            rules: rules,
          },
        });
      }
    },
    [inputsState]
  );

  const validateAll = useCallback(() => {
    let isValid = true;
    if (validatingWithMessages) {
      return lastIsValid;
    }

    setValidatingWithMessages(true);
    for (const id in inputsState) {
      const validationResult = validate(
        id,
        true,
        inputsState[id]!.currentValue
      );
      isValid = isValid && validationResult.isValid;
    }
    setValidatingWithMessages(false);

    return isValid;
  }, [lastIsValid, validatingWithMessages, inputsState]);

  const validateAllWithoutUpdatingInputs = useCallback(() => {
    if (validating) {
      return lastIsValid;
    }
    setValidating(true);
    try {
      const rulesMap = Object.fromEntries(
        Object.entries(inputsState).map(([id, input]) => {
          return [id, input.rules || []];
        })
      );
      const valuesMap = Object.fromEntries(
        Object.entries(inputsState).map(([id, input]) => {
          return [id, input.currentValue];
        })
      );
      const validator = createValidator(rulesMap, inputsState);
      const result = validator(valuesMap);
      setValidating(false);
      const isValid = !!Object.values(result).every((r) => !r);
      if (lastIsValid != isValid) {
        setLastIsValid(isValid);
      }
      return isValid;
    } catch (error) {
      setValidating(false);
      if (lastIsValid != false) {
        setLastIsValid(false);
      }
      return false;
    }
  }, [validating, lastIsValid, inputsState]);

  useEffect(() => {
    validateAllWithoutUpdatingInputs();
  }, [inputsState]);

  useEffect(() => {
    console.log('Last is valid', lastIsValid);
    props.onValidationStateChange?.(lastIsValid);
  }, [lastIsValid]);

  return (
    <FormValidationContext.Provider
      value={{
        defaultProvider: false,
        inputs: inputsState,
        registeredInput: registerInput,
        reset,
        resetAll,
        validate,
        setValue,
        unregisterInput,
        updateInputRules,
        validateAll,
        moveFocusForward,
        loading: props.loading,
        disabled: props.disabled,
        focused: focused,
      }}
    >
      {props.children}
    </FormValidationContext.Provider>
  );
};

export const Form = Object.assign(FormValidation, {
  TonalTextInput,
  Combobox,
  Autocomplete,
  OptionsButtons,
  DatePicker,
});
