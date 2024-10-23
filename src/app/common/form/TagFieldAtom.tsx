import { FormControl, FormErrorMessage, FormLabel, InputProps } from "@chakra-ui/react";
import { FastField } from "formik";
import InputTag from "../input/InputTag";

interface IProps extends InputProps {
  label?: string;
  name?: string;
  isRequired?: boolean;
}

const TagFieldAtom = ({ label, isRequired, ...props }: IProps) => {
  return (
    <FastField name={props.name}>
      {({ field, form }: any) => (
        <>
          <FormControl
            isInvalid={form.errors[field.name] && form.touched[field.name]}
            isRequired={isRequired}
          >
            <FormLabel className="title_label">{label}</FormLabel>

            <InputTag
              {...field}
              {...props}
              tags={form.values[field.name]}
              onChange={(value) => form.setFieldValue(field.name, value)}
            />

            <FormErrorMessage paddingLeft={5}>{form.errors[field.name]}</FormErrorMessage>
          </FormControl>
        </>
      )}
    </FastField>
  );
};

export default TagFieldAtom;
