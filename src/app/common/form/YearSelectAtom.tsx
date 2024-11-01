import { FormControl, FormErrorMessage, FormLabel, Select, SelectProps } from '@chakra-ui/react';
import { FastField } from 'formik';

interface IProps extends SelectProps {
    label?: string;
    name?: string;
    isRequired?: boolean;
    color?: string;
}

const YearSelectAtom = ({ label, isRequired, ...props }: IProps) => {
    // Tạo danh sách năm từ 1900 đến năm hiện tại
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => currentYear - i);

    return (
        <FastField name={props.name}>
            {({ field, form }: any) => (
                <FormControl
                    isInvalid={form.errors[field.name] && form.touched[field.name]}
                    isRequired={isRequired}
                >
                    <FormLabel className="title_label">{label}</FormLabel>
                    <Select
                        {...field}
                        {...props}
                        placeholder="Chọn năm"
                        bg="#FFF"
                        width="200px"
                    >
                        {years.map(year => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </Select>

                    <FormErrorMessage paddingLeft={5}>{form.errors[field.name]}</FormErrorMessage>
                </FormControl>
            )}
        </FastField>
    );
};

export default YearSelectAtom;
