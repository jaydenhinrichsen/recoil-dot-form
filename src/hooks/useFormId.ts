import React from 'react';
import { FormId } from '../context/FormId';

export const useFormId = () => {
  const id = React.useContext(FormId);

  if (!id) throw new Error('useFormId called outside of <Form /> context');
  return id;
};
