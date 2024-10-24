import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputProps,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import { FastField } from 'formik';
interface IProps extends InputProps {
  label?: string;
  name?: string;
  isRequired?: boolean;
}
function NumberFieldAtom({ label, isRequired, ...props }: IProps) {
  return (
    <FastField name={props.name}>
      {({ field, form }: any) => (
        <FormControl
          isInvalid={form.errors[field.name] && form.touched[field.name]}
          isRequired={isRequired}
        >
          <FormLabel className="title_label"> {label}</FormLabel>

          <NumberInput value={field.value}>
            <NumberInputField
              {...field}
              {...props}
              value={field.value}
              variant="outline"
              _focus={{ boxShadow: 'none', borderColor: 'blue.500' }}
              borderColor="gray.300"
              size="lg"
            />
          
          </NumberInput>
       
          <FormErrorMessage paddingLeft={5}>{form.errors[field.name]}</FormErrorMessage>
        </FormControl>
      )}
    </FastField>
  );
}

export default NumberFieldAtom;
