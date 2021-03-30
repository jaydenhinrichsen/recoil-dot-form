import { atomFamily } from 'recoil';
import { FieldMeta } from '../types';

export const fieldMeta = atomFamily<FieldMeta, string>({
  key: 'recoil-dot-form/FieldMeta',
  default: {
    valid: true,
    touched: false,
    dirty: false,
  },
});
