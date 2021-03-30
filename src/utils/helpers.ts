import { FieldId } from '../types';

export const uid = () => Math.random().toString(32).slice(2);

export const fieldId = ({ formId, name }: FieldId) => `${formId}-${name}`;
