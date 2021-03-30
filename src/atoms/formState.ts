import { atomFamily } from 'recoil';
import { FormState } from '../types';

export const formState = atomFamily<FormState, string>({
  key: 'recoil-dot-form/FormState',
  default: {},
});
