import React from 'react';
import {
  useRecoilCallback,
  useRecoilState,
  useSetRecoilState,
} from 'recoil';
import { formState, formMeta, formSchema } from '../atoms';
import {
  FieldValue,
  FormSchema,
  InitialValues,
  OnSubmit,
} from '../types';

export function useForm<T extends InitialValues>(
  id: string,
  onSubmit: OnSubmit<T>,
  initialValues?: T,
  schema?: FormSchema<Record<string, FieldValue>>,
) {
  const setFormState = useSetRecoilState(formState(id));
  const [_formMeta, setFormMeta] = useRecoilState(formMeta(id));
  const setSchema = useSetRecoilState(formSchema(id));

  React.useEffect(() => {
    setSchema(schema);
    setFormState(initialValues || {});
  }, [initialValues, setFormState, schema, setSchema]);

  const submitValues = useRecoilCallback(({ snapshot }) => async (): Promise<T> => {
    return await snapshot.getPromise(formState(id)) as T;
  });

  const handleSubmit = async (e: React.BaseSyntheticEvent) => {
    try {
      setFormMeta((prev) => ({ ...prev, submitting: true }));
      e.preventDefault();
      const values = await submitValues();
      onSubmit(values, setFormMeta);
    } catch (error) {
      throw new Error(`An error occurred during form submission: ${error}`);
    }
  };

  return {
    onSubmit: handleSubmit,
    meta: _formMeta,
  };
}
