import { FormControl, FormErrorMessage, FormLabel, InputProps } from '@chakra-ui/react';
import Select from 'react-select';
import { FastField } from 'formik';

interface IProps extends InputProps {
    label?: string;
    name?: string;
    isRequired?: boolean;
    options?: { value: string | number; label: string | number }[];
}

function MultiSelectDataAtom({ label, isRequired, options, ...props }: IProps) {
    return (
        <FastField name={props.name}>
            {({ field, form }: any) => {
                const handleChange = (selectedOptions: any) => {
                    const value = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
                    form.setFieldValue(field.name, value);
                };

                return (
                    <FormControl
                        isInvalid={form.errors[field.name] && form.touched[field.name]}
                        isRequired={isRequired}
                    >
                        <FormLabel className="title_label"> {label} </FormLabel>

                        <Select
                            menuShouldScrollIntoView={false}
                            menuPlacement="top"
                            closeMenuOnSelect={false}
                            isMulti
                            name={field.name}
                            value={options?.filter(option => field.value.includes(option.value)) || []}
                            options={options}
                            placeholder="Chọn"
                            onChange={handleChange}
                        />

                        <FormErrorMessage paddingLeft={5}>{form.errors[field.name]}</FormErrorMessage>
                    </FormControl>
                );
            }}
        </FastField>
    );
}

export default MultiSelectDataAtom;
