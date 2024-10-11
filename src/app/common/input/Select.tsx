import { InputProps, Select } from '@chakra-ui/react'
import React from 'react'

interface SelectInputProps extends InputProps {
    items: { id: number | string; name: string }[];
}

const SelectComponent: React.FC<SelectInputProps> = (props) => {
    const { items } = props;
    return (
        <Select
            size="lg"
            backgroundColor="#FFF"
            border="1px solid rgba(51, 51, 51, 0.30)"
            width="22.8125rem"
            borderRadius='1rem'
            height='3.75rem'
            flexShrink='0'
        >
            {items.map((item) => (
                <option value={item.id}>{item.name}</option>
            ))}

        </Select>
    )
}

export default SelectComponent