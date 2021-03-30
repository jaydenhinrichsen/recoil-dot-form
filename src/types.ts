import React from 'react';
import * as yup from 'yup';
import { DefaultValue, RecoilState, SetterOrUpdater } from 'recoil';

type Primitive = string | number | boolean | File | undefined;

export type FieldValue = Primitive
| Primitive[]
| Record<string, Primitive | Primitive[]>[];

export type FieldId = { formId: string, name: string };
export type FormState = { [x: string]: FieldValue };
export type InitialValues = FormState;
export type FieldNameConstraint = keyof any & string;

export type RecoilSetter<T> = (
  recoilVal: RecoilState<T>,
  newVal: DefaultValue | T | ((prevValue: T) => DefaultValue | T),
) => void;

export type FieldValidation = {
  valid: boolean;
  errors?: string[];
};

export type FormMeta = {
  errors?: Record<string, string[]>;
  canSubmit: boolean;
  submitting: boolean;
};

export type FieldMeta = {
  touched: boolean;
  dirty: boolean;
  valid: boolean;
  errors?: string[];
};

export type FieldProps<V> = {
  value?: V;
  meta: FieldMeta;
  form?: FormMeta;
  onChange: (value?: V) => void;
  onFocus?: () => void;
};

export type InjectedFieldProps<
T extends Record<K, FieldValue>,
K extends FieldNameConstraint,
P extends FieldProps<T[K]>
> = Omit<P, keyof FieldProps<T[K]>> & {
  name: K;
  As?: React.ComponentType<P>
};

export type FormFieldChild<T extends InitialValues> = <
K extends keyof T & string,
P extends FieldProps<T[K]>
>(
  props: InjectedFieldProps<T, K, P>,
) => JSX.Element;

type FormChildren<T extends InitialValues> = React.ReactNode | ((
  Field: FormFieldChild<T>,
  meta: FormMeta,
) => React.ReactNode);

export type OnSubmit<T> = (
  values: T,
  setFormMeta: SetterOrUpdater<FormMeta>,
) => Promise<void> | void;

export type FormSchema<T> = yup.SchemaOf<T>;
export type FormProps<T extends InitialValues> = {
  initialValues?: T;
  schema?: yup.SchemaOf<T>;
  onSubmit: OnSubmit<T>;
  noForm?: boolean;
  children: FormChildren<T>;
};
