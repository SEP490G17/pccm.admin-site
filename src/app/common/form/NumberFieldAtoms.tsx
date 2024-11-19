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
  isDisabled?: boolean;
}
function NumberFieldAtom({ label, isRequired, isDisabled, ...props }: IProps) {
  return (
    <FastField name={props.name}>
      {({ field, form }: any) => (
        <FormControl
          isInvalid={form.errors[field.name] && form.touched[field.name]}
          isRequired={isRequired}
          isDisabled={isDisabled}
        >
          <FormLabel className="title_label"> {label}</FormLabel>

          <NumberInput value={field.value} clampValueOnBlur min={0}>
            <NumberInputField
              {...field}
              {...props}
              value={field.value}
              variant="outline"
              _focus={{ boxShadow: 'none', borderColor: 'blue.500' }}
              borderColor="gray.300"
              size="lg"
              onKeyDown={(e) => {
                if (e.key === 'e' || e.key === 'E' || e.key === '-' || e.key === '+') {
                  e.preventDefault();
                }
              }}
              onPaste={(e) => {
                const pastedText = e.clipboardData.getData('Text');
                if (parseFloat(pastedText) < 0) {
                  e.preventDefault();
                }
              }}
            />

          </NumberInput>

          <FormErrorMessage paddingLeft={5}>{form.errors[field.name]}</FormErrorMessage>
        </FormControl>
      )}
    </FastField>
  );
}

export default NumberFieldAtom;
