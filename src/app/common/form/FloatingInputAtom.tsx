import { Field, ErrorMessage } from "formik";
import {
  FormControl,
  FormLabel,
  Input,
  InputProps,
  FormErrorMessage,
} from "@chakra-ui/react";

interface FloatingInputProps extends InputProps {
  label: string;
  name: string;
}
function FloatingInputAtom({ label, ...props }: FloatingInputProps) {
  return (
    <Field name={props.name}>
      {({ field, form }: any) => (
        <FormControl
        isInvalid={form.errors[field.name] && form.touched[field.name]}
        position="relative"
        mb={4}
      >
        <Input
          {...field}
          {...props}
          placeholder=" "
          variant="outline"
          _focus={{ boxShadow: "none", borderColor: "blue.500" }}
          borderColor="gray.300"
          size="lg"
          height={props.height || "40px"} // Chiều cao động
          sx={{
            "&:not(:placeholder-shown) + label, &:focus + label": {
              top: "0.3rem",
              left: "0.5rem",
              fontSize: "sm",
              color: "blue.500",
            },
          }}
        />
        <FormLabel
          position="absolute"
          top="50%"
          left="0.75rem"
          transform="translateY(-50%)"
          transition="0.2s ease-in-out"
          backgroundColor="white"
          zIndex={10}
          px="2"
          color="gray.500"
          pointerEvents="none"
        >
          {label}
        </FormLabel>
      </FormControl>
      )}
    </Field>
  );
}

export default FloatingInputAtom;
