import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  FormValidationContext,
  incrementIdCounter,
  type InputsMap,
} from './context';
import { createValidator, type RulesList } from '../../client-validation-rules';

export type UseFormValidation = {
  currentValue: any;
  validationErrorMessage: null | string;
  resetAll: (mountedReset: boolean) => void;
  validateAll: () => boolean;
  reset: () => void;
  loading?: boolean;
  disabled?: boolean;
  required: boolean;
  setValue: (value: any) => void;
  validate: () => void;
  id: string;
  allInputs: InputsMap;
  moveFocusForward: () => void;
};

export const useFormValidation = (props: {
  rules?: RulesList;
  id?: string;
  initialValue?: any;
  dynamicRules?: boolean;
  onReset: (mountedReset: boolean) => void;
  onFocus?: () => void;
}): UseFormValidation => {
  /**
   *
   * if you face and error "useSignal cant be called ...." copy this code block in every input component you create
   *
   * this block of code cant be placed in a hook because preact signals throws errors
   */

  /////////////////// Use Hook Start ////////////////////////////

  ///////////////////////////////////////////////
  props.dynamicRules =
    props.dynamicRules === undefined ? false : props.dynamicRules;

  const [rulesList, setRulesList] = useState([] as RulesList);
  const [currentValue, setCurrentValue] = useState(null as any);
  const [validationErrorMessage, setValidationErrorMessage] = useState(
    null as null | string
  );

  const formContextController = useContext(FormValidationContext);

  const id = useMemo(() => {
    if (props.id) {
      return props.id;
    }
    const id = incrementIdCounter();
    return String(id);
  }, []);

  const validator = useMemo(() => {
    const validator = createValidator({
      field: rulesList,
    });
    return validator;
  }, [rulesList]);

  useEffect(() => {
    if (!formContextController.defaultProvider) {
      formContextController.registeredInput(id, {
        rules: props.rules || [],
        value: props.initialValue,
        onReset: props.onReset,
      });
      return () => {
        formContextController.unregisterInput(id);
      };
    }
    return undefined;
  }, [id, formContextController.defaultProvider]);

  useEffect(() => {
    setTimeout(() => {
      reset(true);
    }, 5);
  }, []);

  useEffect(() => {
    if (formContextController.defaultProvider) {
      setRulesList(props.rules || []);
    } else {
      formContextController.updateInputRules(id, props.rules || []);
    }
  }, [
    formContextController.defaultProvider,
    props.dynamicRules && props.rules,
  ]);

  useEffect(() => {
    const result = validator({
      field: currentValue,
    });
    setValidationErrorMessage(result.field || null);
  }, [validator, currentValue]);

  let focused: null | string = null;

  focused = formContextController.defaultProvider
    ? null
    : formContextController.focused;

  useEffect(() => {
    if (focused && focused === id) {
      props.onFocus?.();
    }
  }, [focused]);

  const validate = useCallback(() => {
    const result = validator({
      field: currentValue,
    });
    setValidationErrorMessage(result.field || null);
    return {
      validationErrorMessage: result.field || null,
      isValid: !result.field,
    };
  }, [validator, currentValue]);

  const setValue = useCallback(
    (value: any) => {
      if (formContextController.defaultProvider) {
        setCurrentValue(value);
      } else {
        formContextController.setValue(id, value);
      }
    },
    [
      formContextController.defaultProvider,
      !formContextController.defaultProvider && formContextController.setValue,
    ]
  );

  const reset = useCallback(
    (mountedReset = false) => {
      if (formContextController.defaultProvider) {
        props.onReset(mountedReset);
        setValidationErrorMessage(null);
      } else {
        props.onReset(mountedReset);
        formContextController.reset(id);
      }
    },
    [
      formContextController.defaultProvider,
      !formContextController.defaultProvider && formContextController.reset,
    ]
  );

  const required = useMemo(() => {
    const rule = props.rules?.find((r) => {
      return r.name == 'required';
    });
    return !!rule;
  }, []);

  const moveFocusForward = useCallback(() => {
    if (!formContextController.defaultProvider) {
      formContextController.moveFocusForward(id);
    }
  }, []);

  const formContext: UseFormValidation = {
    currentValue: formContextController.defaultProvider
      ? currentValue
      : formContextController.inputs[id]?.currentValue || null,
    validationErrorMessage: formContextController.defaultProvider
      ? validationErrorMessage
      : formContextController.inputs[id]?.validationErrorMessage || null,
    reset,
    required,
    resetAll: formContextController.defaultProvider
      ? reset
      : formContextController.resetAll,
    validateAll: formContextController.defaultProvider
      ? () => validate().isValid
      : formContextController.validateAll,
    setValue,
    validate,
    id,
    allInputs: formContextController.defaultProvider
      ? {
          [id]: {
            rules: rulesList,
            currentValue: currentValue,
            validationErrorMessage: validationErrorMessage,
            onReset: props.onReset,
          },
        }
      : formContextController.inputs,
    loading: !formContextController.defaultProvider
      ? formContextController.loading
      : undefined,
    disabled: !formContextController.defaultProvider
      ? formContextController.disabled
      : undefined,
    moveFocusForward,
  };
  ///////////////////////////////////////////////
  /////////////////// Use Hook End ////////////////////////////
  return formContext;
};
