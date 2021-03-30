import * as yup from 'yup';
import { selectorFamily } from 'recoil';
import { fieldMeta } from './fieldMeta';
import { formSchema } from './formSchema';
import { formState } from './formState';
import { formMeta } from './formMeta';
import { fieldId } from '../utils/helpers';
import { FieldId, FieldValue, RecoilSetter } from '../types';

function validateField(
  set: RecoilSetter<any>,
  params: FieldId,
  value: FieldValue,
  schema: yup.SchemaOf<Record<string, FieldValue>>,
): void {
  try {
    if (schema && Object.keys(schema.fields).includes(params.name)) {
      schema.fields[params.name].validateSync(value, { abortEarly: false });
      set(fieldMeta(fieldId(params)), (prevState: any) => ({
        ...prevState,
        errors: [],
        valid: true,
      }));
      set(formMeta(params.formId), (prevState: any) => {
        const errors = { ...(prevState.errors || {}) };
        delete errors[params.name];
        return {
          ...prevState,
          errors,
          canSubmit: Object.keys(errors).length <= 0,
        };
      });
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      set(fieldMeta(fieldId(params)), (prevState: any) => ({
        ...prevState,
        errors: error.errors,
        valid: false,
      }));
      set(formMeta(params.formId), (prevState: any) => {
        const errors = {
          ...(prevState.errors || {}),
          [params.name]: error.errors,
        };
        return {
          ...prevState,
          errors,
          canSubmit: Object.keys(errors).length <= 0,
        };
      });
    } else {
      // eslint-disable-next-line no-console
      console.warn(`An unknown error occurred during field validation ${error}`);
    }
  }
}

export const fieldValue = selectorFamily<any, { formId: string, name: string }>({
  key: 'recoil-dot-form/FieldValue',
  get: (params) => ({ get }) => get(formState(params.formId))[params.name],
  set: (params) => ({ set, get }, newValue) => {
    const schema = get(formSchema(params.formId));
    if (schema) validateField(set, params, newValue, schema);
    return set(formState(params.formId), (prevState) => ({
      ...prevState, [params.name]: newValue,
    }));
  },
});
