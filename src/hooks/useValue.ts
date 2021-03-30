import React from 'react';

export const useValue = <T>(initialValue: T) => {
  const [value, setValue] = React.useState<T>(initialValue);
  const update = React.useCallback((val: T) => setValue(val), []);

  return [value, update] as const;
};
