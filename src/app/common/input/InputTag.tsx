import React, { useEffect, useRef, useState } from "react";
import { Tag, TagCloseButton, Stack } from "@chakra-ui/react";
import "./style.scss";

interface TagProps {
    tags?: string[];
    onChange: (tags: string[]) => void;
}

const InputTag: React.FC<TagProps> = ({ tags = [], onChange }: TagProps) => {
    const [dataInput, setDataInput] = useState<string[]>(tags);
    const [sizeInput, setSizeInput] = useState(2);
    const refInput = useRef<HTMLInputElement>(null);

    const handleKeyUp = (event: KeyboardEvent) => {
        const newText = refInput.current?.value.trim().replace(",", "");
        if (event.key === ",") {
            if (newText && newText.length >= 0) {
                const updatedTags = [...dataInput, newText];
                setDataInput(updatedTags);
                onChange(updatedTags);
                if (refInput.current) refInput.current.value = "";
            }
        }
    };

    useEffect(() => {
        window.addEventListener("keyup", handleKeyUp);
        return () => window.removeEventListener("keyup", handleKeyUp);
    }, [dataInput, onChange]);

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSizeInput(value.trim().length > 0 ? value.length : 1);
    };

    const handleDelItem = (index: number) => {
        const updatedTags = dataInput.filter((_, i) => i !== index);
        setDataInput(updatedTags);
        onChange(updatedTags);
    };

    const handleDelAllItem = () => {
        setDataInput([]);
        onChange([]);
    };

    return (
        <div className='input-tag'>
            <Stack direction='row' margin='0.5rem 0 0 0.5rem'>
                <Tag colorScheme="blackAlpha" className='item_text'>
                    <TagCloseButton margin='0' onClick={() => handleDelAllItem()} />
                </Tag>

                {dataInput.map((text, i) => (
                    <Tag key={`${i}_${text}`} colorScheme="blackAlpha" className='item_text'>
                        <TagCloseButton margin='0' onClick={() => handleDelItem(i)} />
                        {text}
                    </Tag>
                ))}

                <input
                    ref={refInput}
                    onChange={handleChangeInput}
                    className='input'
                    size={sizeInput}
                />
            </Stack>
        </div>
    );
}


export default InputTag;
