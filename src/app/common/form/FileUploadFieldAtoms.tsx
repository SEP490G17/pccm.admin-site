import { FastField } from 'formik';
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
          <FileUpload isRequired limit={limit} label={label} name={name} value={field.value}/>
        </FormControl>
      )}
    </FastField>
  );
}

export default FileUploadFieldAtoms;
