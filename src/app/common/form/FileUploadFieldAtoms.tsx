import { FastField } from 'formik';
import React from 'react';
import FileUpload from '../input/FileUpload';
import { FormControl } from '@chakra-ui/react';

interface IProp {
  limit?: number;
  label?: string;
  name?: string;
  isRequired?: boolean;
}
function FileUploadFieldAtoms({ limit = 1, label, name = 'image', isRequired = false }: IProp) {
  return (
    <FastField name={name}>
      {({ field, form }:any) => (
        <FormControl
          isInvalid={form.errors[field.name] && form.touched[field.name]}
          isRequired={isRequired}
        >
          <FileUpload limit={limit} label={label} name={name} />
        </FormControl>
      )}
    </FastField>
  );
}

export default FileUploadFieldAtoms;
