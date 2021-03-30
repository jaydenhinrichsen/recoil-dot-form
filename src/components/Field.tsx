import React from 'react';
import { useField } from '../hooks/useField';
import {
  FieldNameConstraint,
  InjectedFieldProps,
  FieldValue,
  FieldProps,
} from '../types';

type Props<
T extends Record<K, FieldValue>,
K extends FieldNameConstraint,
P extends FieldProps<T[K]>
> = InjectedFieldProps<T, K, P> & {
  initialValue?: T[K];
};

const FieldComponent = <
T extends Record<K, FieldValue>,
K extends FieldNameConstraint,
P extends FieldProps<T[K]>
>({ name, initialValue, As, ...rest }: Props<T, K, P>) => {
  const fieldProps = useField<K>({ name, initialValue });

  if (As) return <As {...fieldProps as P} {...rest} />;
  return null;
};

export const Field = React.memo(FieldComponent, (prev, next) => {
  return JSON.stringify(prev) === JSON.stringify(next);
});
