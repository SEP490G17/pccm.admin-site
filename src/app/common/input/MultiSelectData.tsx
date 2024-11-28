import Select, { MultiValue } from 'react-select';

interface MultiSelectProps {
    items: { value: string | number; label: string | number; }[];
    value?: MultiValue<{ value: string | number; label: string | number }>;
    onChange?: (value: MultiValue<{ value: string | number; label: string | number }>) => void;
}

const MultiSelectData: React.FC<MultiSelectProps> = (props) => {
    const { items, value, onChange } = props;
    const options = items
        .map(item => ({
            value: item.value,
            label: item.label,
        }));

    return (
        <Select
            menuShouldScrollIntoView={false}
            menuPlacement="top"
            closeMenuOnSelect={true}
            isMulti
            options={options}
            placeholder="Chọn"
            value={value}
            onChange={onChange}
        />
    );
};

export default MultiSelectData