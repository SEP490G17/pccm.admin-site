import { Box, FormControl, FormErrorMessage, FormLabel, InputProps } from '@chakra-ui/react';
import { FastField } from 'formik';
import ReactQuillComponent from '../input/ReactQuill';

interface IProps extends InputProps {
    label?: string;
    name?: string;
    isRequired?: boolean;
}

const ReactQuillAtom = ({ label, isRequired, ...props }: IProps) => {
    return (
        <FastField name={props.name}>
            {({ field, form }: any) => (
                <FormControl
                    isInvalid={form.errors[field.name] && form.touched[field.name]}
                    isRequired={isRequired}
                >
                    <FormLabel className="title_label"> {label}</FormLabel>

                    <Box mb="7rem">
                        <ReactQuillComponent
                            {...field}
                            {...props}
                            content={field.value}
                            onChange={(value) => form.setFieldValue(field.name, value)}
                        />
                    </Box>

                    <FormErrorMessage paddingLeft={5}>
                        {form.errors[field.name]}
                    </FormErrorMessage>
                </FormControl>
            )}
        </FastField>
    );
};

export default ReactQuillAtom;
