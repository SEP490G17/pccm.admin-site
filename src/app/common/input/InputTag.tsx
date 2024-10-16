import { useEffect, useRef, useState } from "react";
import { Tag, TagCloseButton, Stack } from "@chakra-ui/react";
import "./style.scss";

const dataTemp = ["pickleball", "Hà Nội"];

export default function InputTag() {
    const [dataInput, setDataInput] = useState([...dataTemp]);
    const [sizeInput, setSizeInput] = useState(2);
    const refInput = useRef<HTMLInputElement>(null); // Specify the type here

    useEffect(() => {
        refInput.current?.focus(); // Auto focus input

        const handleKeyUp = (event: KeyboardEvent) => {
            const newText = refInput.current?.value.trim().replace(",", "");
            if (event.key === "," || event.key === "Enter") {
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
        setSizeInput(value.trim().length > 0 ? value.length : 1); // Adjust size based on input
    };

    const handleDelItem = (index: number) => {
        setDataInput((prevData) => prevData.filter((_, i) => i !== index)); // Remove item by index
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
