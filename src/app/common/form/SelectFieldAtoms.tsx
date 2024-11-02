import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
  SelectProps,
} from '@chakra-ui/react';
import { FastField } from 'formik';
interface IProps extends SelectProps {
  label?: string;
  name?: string;
  isRequired?: boolean;
  options: Array<{ value: string | number; label: string }>;
}
function SelectFieldAtoms({ label, options, isRequired, ...props }: IProps) {
  return (
    <FastField name={props.name}>
      {({ field, form }: any) => (
        <FormControl
          isInvalid={form.errors[field.name] && form.touched[field.name]}
          isRequired={isRequired}
        >
          {label && <FormLabel className="title_label"> {label}</FormLabel>}

          <Select {...field} {...props}
          >
            {options.map(option => {
              return (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              )
            })}
          </Select>

          <FormErrorMessage paddingLeft={5}>{form.errors[field.name]}</FormErrorMessage>
        </FormControl>
      )}
    </FastField>
  );
}

export default SelectFieldAtoms;
