import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useFormId } from './useFormId';
import { useValue } from './useValue';
import { fieldValue, fieldMeta } from '../atoms';
import { FieldNameConstraint, FieldValue } from '../types';
import { fieldId } from '../utils/helpers';

type UseFieldProps<
K extends FieldNameConstraint
> = {
  name: K;
  initialValue?: FieldValue;
};

export function useField<
K extends FieldNameConstraint
>({ name, initialValue }: UseFieldProps<K>) {
  const formId = useFormId();
  const [firstRender, setFirstRender] = React.useState(true);
  const [meta, setMeta] = useRecoilState(fieldMeta(fieldId({ formId, name })));
  // Not subscribing to updates from formState as that would cause rerenders for every field
  const onChange = useSetRecoilState(fieldValue({ name, formId }));
  // Because we aren't subscribing to updates for this field's atom we need
  // a way to trigger a rerender onChange for the field and a way to store
  // the current value of the field.
  const [value, update] = useValue(initialValue);

  React.useEffect(() => {
    if (firstRender) {
      onChange(initialValue);
      setFirstRender(false);
    }
  }, [firstRender, initialValue, onChange]);

  const handleChange = React.useCallback((val: FieldValue) => {
    onChange(val);
    update(val);
  }, [onChange, update]);

  const handleFocus = () => {
    if (!meta.touched) setMeta((prev) => ({ ...prev, touched: true }));
  };

  return {
    value,
    meta,
    onChange: handleChange,
    onFocus: handleFocus,
  };
}
