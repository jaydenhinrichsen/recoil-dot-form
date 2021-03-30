import React from 'react';
import { uid } from '../utils/helpers';
import { FormId } from '../context/FormId';
import { useForm } from '../hooks/useForm';
import {
  FieldProps,
  InjectedFieldProps,
  FormProps,
  InitialValues,
} from '../types';
import { Field } from './Field';

export function Form<T extends InitialValues>({
  initialValues,
  schema,
  onSubmit,
  noForm = false,
  children,
}: FormProps<T>) {
  const id = React.useMemo(() => uid(), []);
  const form = useForm(id, onSubmit, initialValues, schema);

  const FieldWithInitialValue = React.useCallback(<
    K extends keyof T & string,
    P extends FieldProps<T[K]>
  >(fieldProps: InjectedFieldProps<T, K, P>) => {
    return (
      <Field
        {...fieldProps as any}
        initialValue={initialValues ? initialValues[fieldProps.name] : undefined}
      />
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues, schema]);

  const _children = React.useMemo(() => {
    if (typeof children !== 'function') return children;
    return children(FieldWithInitialValue, form.meta);
  }, [children, FieldWithInitialValue, form.meta]);

  return (
    <FormId.Provider value={id}>
      {noForm ? _children : (
        <form onSubmit={form.onSubmit}>
          {_children}
        </form>
      )}
    </FormId.Provider>
  );
}
