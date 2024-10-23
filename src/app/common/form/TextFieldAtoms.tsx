import { FormControl, FormErrorMessage, FormLabel, Input, InputProps } from '@chakra-ui/react';
import { FastField } from 'formik';
interface IProps extends InputProps {
  label?: string;
  name?: string;
  isRequired?: boolean;
}
function TextFieldAtoms({ label, isRequired,...props }: IProps) {
  return (
    <FastField name={props.name}>
      {({ field, form }: any) => (
        <FormControl
          isInvalid={form.errors[field.name] && form.touched[field.name]}
          isRequired={isRequired}
        >
          <FormLabel className="title_label"> {label}</FormLabel>

          <Input
            {...field}
            {...props}
            variant="outline"
            _focus={{ boxShadow: 'none', borderColor: 'blue.500' }}
            borderColor="gray.300"
            size="lg"
          />

          <FormErrorMessage paddingLeft={5}>{form.errors[field.name]}</FormErrorMessage>
        </FormControl>
      )}
    </FastField>
  );
}

export default TextFieldAtoms;
