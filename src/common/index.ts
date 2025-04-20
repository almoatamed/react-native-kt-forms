export type Merge<T, U> = T & Omit<U, keyof T>;

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

export function fixed(value: string | number, n = 2) {
  return Number(Number(value).toFixed(n));
}

export const splitConcatenatedWords = (phrase: string) => {
  return phrase.replaceAll(/(?<=[A-Z][a-z]*?)(?=[A-Z])/g, ' ');
};

export const capitalize = (inputString: string) => {
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

const padStart = (string: string, targetLength: number, padString: string) => {
  targetLength = targetLength >> 0;
  string = String(string);
  padString = String(padString);

  if (string.length > targetLength) {
    return String(string);
  }

  targetLength = targetLength - string.length;

  if (targetLength > padString.length) {
    padString += padString.repeat(targetLength / padString.length);
  }

  return padString.slice(0, targetLength) + String(string);
};

const padDate = (n: string, length = 2) => padStart(n, length, '0');

export const path = {
  join: function pathJoin(...args: string[]) {
    return args
      .map((part, i) => {
        if (i === 0) {
          return part.trim().replace(/[/\\]+$/, ''); // Trim trailing slashes for the first part
        } else {
          return part.trim().replace(/(^[/\\]+|[/\\]+$)/g, ''); // Trim both leading and trailing slashes for other parts
        }
      })
      .filter(Boolean) // Remove empty strings
      .join('/');
  },
};

export function dashDateFormatter(
  date: Date,
  config: {
    getDate?: boolean;
    getTime?: boolean;
    dateFormat: 'mm-yyyy' | 'yyyy-mm' | 'yyyy-mm-dd';
  }
): string {
  date = new Date(date);
  const month = padDate(String(date.getMonth() + 1));
  const dayOfMonth = padDate(String(date.getDate()));
  const fullYear = date.getFullYear();
  const hour = padDate(String(date.getHours()));
  const minutes = padDate(String(date.getMinutes()));
  const seconds = padDate(String(date.getSeconds()));

  const timeString = `${hour}:${minutes}:${seconds}`;
  let dateString: string;
  if (config?.dateFormat === 'mm-yyyy') {
    dateString = `${month}-${fullYear}`;
  } else if (config?.dateFormat === 'yyyy-mm') {
    dateString = `${fullYear}-${month}`;
  } else {
    dateString = `${fullYear}-${month}-${dayOfMonth}`;
  }

  if (config?.getDate && config?.getTime) {
    return `${dateString} ${timeString}`;
  } else if (config?.getDate && !config?.getTime) {
    return dateString;
  } else {
    return timeString;
  }
}
