import { DotPath, DotValue, Flat } from './types';

export function get<T, P extends DotPath<T> & string>(
  obj: T,
  path: P,
  separator: string = '.',
): DotValue<T, P> {
  const o: any = obj;
  let value: any;

  path.split(separator).forEach((key, i) => {
    value = i === 0 ? o[key] : value[key];
  });

  return value as DotValue<T, P>;
}

export function flatten<T>(t: T): Flat<T> {
  const output: any = {};

  function step<O>(o: O, prev?: string) {
    // eslint-disable-next-line consistent-return
    Object.keys(o).forEach((key) => {
      const value = (o as any)[key];
      const newKey = prev ? `${prev}.${key}` : key;
      if (Array.isArray(value)) {
        output[newKey] = value.map((el) => flatten<O>(el));
        return;
      }
      if (typeof value === 'object') {
        // eslint-disable-next-line consistent-return
        return step(value, newKey);
      }

      output[newKey] = value;
    });
  }

  step(t);

  return output;
}
