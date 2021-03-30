import { atomFamily } from 'recoil';
import { FormMeta } from '../types';

export const formMeta = atomFamily<FormMeta, string>({
  key: 'recoil-dot-form/FormMeta',
  default: {
    errors: undefined,
    canSubmit: true,
    submitting: false,
  },
});
