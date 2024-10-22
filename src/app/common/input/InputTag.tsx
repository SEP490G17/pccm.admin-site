import React, { useEffect, useRef, useState } from "react";
import { Tag, TagCloseButton, Stack, InputProps } from "@chakra-ui/react";
import "./style.scss";

interface TagProps extends InputProps{
    tags? : string[]
}

const InputTag : React.FC<TagProps> = (props) => {
    const [dataInput, setDataInput] = useState<string[]>(props.tags ?? []);
    const [sizeInput, setSizeInput] = useState(2);
    const refInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        refInput.current?.focus();

        const handleKeyUp = (event: KeyboardEvent) => {
            const newText = refInput.current?.value.trim().replace(",", "");
            if (event.key === ",") {
                if (newText && newText.length >= 0) {
                    setDataInput((prevData) => [...prevData, newText]);
                    if (refInput.current) refInput.current.value = "";
                }
            }
        };

        window.addEventListener("keyup", handleKeyUp);
        return () => window.removeEventListener("keyup", handleKeyUp);
    }, [dataInput]);

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSizeInput(value.trim().length > 0 ? value.length : 1);
    };

    const handleDelItem = (index: number) => {
        setDataInput((prevData) => prevData.filter((_, i) => i !== index));
    };

    const handleDelAllItem = () => {
        setDataInput([]);
    };

    return (
        <div className='input-tag'>
            <Stack
                direction='row'
                margin='0.5rem 0 0 0.5rem'
            >
                <Tag colorScheme="blackAlpha" className='item_text'>
                    <TagCloseButton margin='0' onClick={() => handleDelAllItem()} />
                </Tag>

                {dataInput.map((text, i) => (
                    <Tag
                        key={`${i}_${text}`}
                        colorScheme="blackAlpha"
                        className='item_text'
                    >
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

export default InputTag