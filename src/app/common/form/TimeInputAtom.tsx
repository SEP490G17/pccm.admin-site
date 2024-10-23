import { Badge, FormControl, FormErrorMessage, Input, InputProps } from '@chakra-ui/react';
import { FastField } from 'formik';
interface IProps extends InputProps {
    label?: string;
    name?: string;
    isRequired?: boolean;
    type?: string;
    color?: string;
}
const TimeInputAtom = ({ label, isRequired, color,...props }: IProps) => {
    return (
        <FastField name={props.name}>
            {({ field, form }: any) => (
                <FormControl
                    isInvalid={form.errors[field.name] && form.touched[field.name]}
                    isRequired={isRequired}
                >
                    <Badge colorScheme={color} fontSize="1em" padding="8px 16px">
                        {label}
                    </Badge>
                    <Input
                        {...field}
                        {...props}
                        bg="#FFF"
                        width="200px"
                    />

                    <FormErrorMessage paddingLeft={5}>{form.errors[field.name]}</FormErrorMessage>
                </FormControl>
            )}
        </FastField>
    )
}

export default TimeInputAtom