import {ExplicityAny} from '@common/types';

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const removeKeys = (obj: ExplicityAny, keys: string[]) =>
  obj !== Object(obj)
    ? obj
    : Array.isArray(obj)
      ? obj.map((item) => removeKeys(item, keys))
      : Object.keys(obj)
          .filter((k) => !keys.includes(k))
          .reduce(
            (acc, x) => Object.assign(acc, {[x]: removeKeys(obj[x], keys)}),
            {}
          );
