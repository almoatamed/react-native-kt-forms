import type { InputsMap } from '../components/Form/context';

const capitalize = (inputString: string) => {
  if (!inputString) {
    return inputString;
  }
  try {
    let string = inputString.replaceAll(/\b([a-zA-Z]+)\b/g, (word) => {
      return word[0]?.toUpperCase() + word.toLocaleLowerCase().slice(1);
    });
    return string;
  } catch (error) {
    return inputString;
  }
};

const isEmpty = (value: any) => {
  return value === '' || value === null || value === undefined;
};

export const rules = {
  ipAndHostname(field: string) {
    field = capitalize(field);
    return (value: any) => {
      if (isEmpty(value)) {
        return true;
      }
      const msg = `${field} is not valid a hostname address`;
      try {
        const regex =
          /^\blocalhost|(((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,}){1,}))\b$/i;
        if (typeof value != 'string') {
          return msg;
        }
        if (!value.match(regex)) {
          return msg;
        }
        return true;
      } catch (error) {
        return msg;
      }
    };
  },
  inValues: (field: string, source_list: Array<any>) => {
    field = capitalize(field);
    return function inValues(value: any) {
      if (value === null || value === undefined || value === '') {
        return true;
      }
      return (
        !!source_list?.includes(value) ||
        `${field} must be one of required values`
      );
    };
  },
  notInValues: (field: string, source_list: Array<any>) => {
    field = capitalize(field);
    return function inValues(value: any) {
      if (value === null || value === undefined || value === '') {
        return true;
      }
      return !source_list?.includes(value) || `${value} is already used`;
    };
  },
  boolean(field: string) {
    field = capitalize(field);
    return function boolean(value: any) {
      if (value === true || value === false || value === 0 || value === 1) {
        return true;
      }
      return `${field} must Valid Boolean`;
    };
  },
  required: (field: string) => {
    field = capitalize(field);
    return function required(value: any) {
      const message = `${field} is required`;
      if (typeof value == 'object' && Array.isArray(value)) {
        return !!value.length || message;
      } else {
        const result = !isEmpty(value) || message;
        return result;
      }
    };
  },
  description: (field: string, maxLength = 1e4, minLength = 0) => {
    field = capitalize(field);
    return function title(value: any) {
      if (isEmpty(value)) {
        return true;
      }

      if (typeof value != 'string') {
        return `${field} must be a string`;
      }

      if (value.length > maxLength) {
        return `${field} must be less then ${maxLength} in length`;
      }
      if (minLength && value.length < minLength) {
        return `${field} must be greater then ${minLength} in length`;
      }

      return true;
    };
  },
  title: (field: string, maxLength = 250, minLength = 0) => {
    field = capitalize(field);
    return function title(value: any) {
      if (isEmpty(value)) {
        return true;
      }

      if (typeof value != 'string') {
        return `${field} must be a string`;
      }

      if (value.length > maxLength) {
        return `${field} must be less then ${maxLength} in length`;
      }
      if (minLength && value.length < minLength) {
        return `${field} must be greater then ${minLength} in length`;
      }

      return true;
    };
  },
  hex: (field: string, maxLength = 250, minLength = 0) => {
    field = capitalize(field);
    return function hex(value: any) {
      if (isEmpty(value)) {
        return true;
      }
      if (typeof value != 'string') {
        return `${field} must be a string`;
      }
      if (value.length > maxLength) {
        return `${field} must be less then ${maxLength} in length`;
      }
      if (minLength && value.length < minLength) {
        return `${field} must be greater then ${minLength} in length`;
      }
      if (!value.match(/^[A-Fa-f0-9]*$/)) {
        return `${field} must be valid hex containing only '0' to '9' and 'a' to 'f'`;
      }
      return true;
    };
  },
  name: (field: string) => {
    field = capitalize(field);
    return function name(value: any) {
      if (isEmpty(value)) {
        return true;
      }
      try {
        return (
          !!value.trim().match(/^(?:(\p{L}{1,})\s)*?(\p{L}{1,})$/iu) ||
          `${field} is not valid name`
        );
      } catch {
        return `${field} is not valid name`;
      }
    };
  },
  email: (field: string) => {
    field = capitalize(field);
    return function email(value: any) {
      if (isEmpty(value)) {
        return true;
      }
      try {
        return (
          !!value
            .trim()
            .match(
              /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/
            ) || `${field} is not valid email`
        );
      } catch {
        return `${field} is not valid email`;
      }
    };
  },
  senderId: (field: string) => {
    field = capitalize(field);
    return function senderId(value: any) {
      if (isEmpty(value)) {
        return true;
      }
      try {
        return (
          value
            .trim()
            .match(/^[\p{L}0-9][\p{L} ,-_\/\|0-9]{0,}[\p{L}0-9]$/iu) ||
          `invalid sender id`
        );
      } catch (error) {
        return `invalid sender id`;
      }
    };
  },
  phone: (field: string) => {
    field = capitalize(field);
    return function phone(value: any) {
      if (isEmpty(value)) {
        return true;
      }
      try {
        return (
          !!value
            .trim()
            .match(/^(?:00218|\+218|0)?(9(?:1|2|4|5)[0-9]{7})$/iu) ||
          `${field} is not valid phone`
        );
      } catch {
        return `${field} is not valid phone`;
      }
    };
  },
  password: (field: string) => {
    field = capitalize(field);
    return function password(value: any) {
      if (isEmpty(value)) {
        return true;
      }
      try {
        return (
          (value.length >= 8 &&
            !!value
              .trim()
              .match(/^[\\ \/!@#\$%%\^&\*\( \)_\+=\/:\|0-9\p{L}]{0,}$/u)) ||
          `${field} is not valid password`
        );
      } catch {
        return `${field} is not valid password`;
      }
    };
  },
  username: (field: string) => {
    field = capitalize(field);
    return function username(value: any) {
      if (isEmpty(value)) {
        return true;
      }
      try {
        return (
          !!value.trim().match(/^[a-zA-z_][a-zA-z0-9_\-]{3,}$/) ||
          `${field} is not valid username`
        );
      } catch {
        return `${field} is not valid username`;
      }
    };
  },
  number: (field: string, inclusiveMax?: number, inclusiveMin?: number) => {
    field = capitalize(field);
    return function number(value: any) {
      if (isEmpty(value)) {
        return true;
      }
      const msg = `${field} is not a valid number`;
      try {
        const number_value = parseFloat(value);
        if (Number.isNaN(number_value)) {
          return msg;
        }

        if (typeof inclusiveMax === 'number' && number_value > inclusiveMax) {
          return `${field} must be less then ${inclusiveMax}`;
        }

        if (typeof inclusiveMin === 'number' && number_value < inclusiveMin) {
          return `${field} must be greater then ${inclusiveMin}`;
        }
        return true;
      } catch (error) {
        return msg;
      }
    };
  },
};

export type Rule = (v: any, inputsMap?: InputsMap) => string | boolean;
export type RulesList = Rule[];

export const createValidator = <
  R extends {
    [key: string]:
      | ((v: any, inputsMap?: InputsMap) => string | boolean)[]
      | undefined;
  },
>(
  rules: R,
  inputsMap?: InputsMap
) => {
  return (values: { [key in keyof R]: any }) => {
    const errors: { [key in keyof R]: string | undefined } = {} as any;
    for (const key in values) {
      const fieldRules = rules[key];
      for (const rule of fieldRules || []) {
        const validationResult = rule(values[key], inputsMap);
        if (typeof validationResult === 'string') {
          errors[key] = validationResult;
          break;
        }
      }
    }
    return errors;
  };
};
