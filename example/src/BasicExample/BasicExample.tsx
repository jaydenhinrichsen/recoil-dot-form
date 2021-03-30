import React from 'react';
import { Form, flatten, FieldProps } from 'recoil-dot-form';

const person = {
  name: 'John',
  location: {
    country: 'Canada',
    region: 'Alberta',
  },
};

const TextInput = ({ value, onChange }: FieldProps<string>) => {
  return <input value={value} onChange={(e) => onChange(e.target.value)} />;
};

export const BasicExample = () => {
  return (
    <Form initialValues={flatten(person)} onSubmit={() => {}}>
      {(Field, meta) => (
        <React.Fragment>
          <Field name="name" As={TextInput} />
          <Field name="location.country" As={TextInput} />
          <Field name="location.region" As={TextInput} />
        </React.Fragment>
      )}
    </Form>
  );
};
