import { InputProps, Select } from '@chakra-ui/react';
import React from 'react';

interface SelectInputProps extends InputProps {
    items: { id: number | string; name: string; }[];
    onSelectChange: (value: any) => void;
    categoryValue: string;
}

const SelectComponent: React.FC<SelectInputProps> = ({ items, onSelectChange, categoryValue }) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onSelectChange(e.target.value);
    };
    console.log(categoryValue)
    return (
        <Select
            size="lg"
            backgroundColor="#FFF"
            border="1px solid rgba(51, 51, 51, 0.30)"
            width="22.6875rem"
            borderRadius='0.25rem'
            height='3rem'
            flexShrink='0'
            onChange={handleChange}
        >
            {items.map((item) => (
                item.name == categoryValue
                    ?
                    <option key={item.id} value={item.id} selected>
                        {item.name}
                    </option>
                    :
                    <option key={item.id} value={item.id}>
                        {item.name}
                    </option>
            ))}
        </Select>
    );
};

export default SelectComponent;
