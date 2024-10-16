import { InputProps } from '@chakra-ui/react';
import Select from 'react-select';

interface MultiSelectProps extends InputProps {
    items: { name: string | number; value: string | number; }[];
}

const MultiSelectData: React.FC<MultiSelectProps> = (props) => {
    const { items } = props
    const options = items.map(item => ({
        label: item.name,
        value: item.value
    }));
    return (
        <Select
            menuShouldScrollIntoView={false}
            menuPlacement='top'
            closeMenuOnSelect={true}
            defaultValue={options[0]}
            isMulti
            options={options}
            placeholder='Chọn'
        />
    );
}

export default MultiSelectData