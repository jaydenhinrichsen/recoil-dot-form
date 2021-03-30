import * as yup from 'yup';
import { atomFamily } from 'recoil';
import { FieldValue } from '../types';

export const formSchema = atomFamily<
yup.SchemaOf<Record<string, FieldValue>> | undefined,
string
>({
  key: 'recoil-dot-form/FormSchema',
  default: undefined,
});
