import { useState} from "react";
import { Box, Flex, Tag, TagCloseButton } from "@chakra-ui/react";
import "./style.scss";

const dataTemp = ["pickleball", "Hà Nội"];

export default function InputTag() {
     const [dataInput, setDataInput] = useState([...dataTemp]);
    // const [sizeInput, setSizeInput] = useState(1);
    // const refInput = useRef<HTMLInputElement>(null); // Specify the type here

    // useEffect(() => {
    //     refInput.current?.focus(); // Auto focus input

    //     const handleKeyUp = (event: KeyboardEvent) => {
    //         const newText = refInput.current?.value.trim().replace(",", ""); // Use optional chaining
    //         if (event.key === "," || event.key === "Enter") {
    //             if (newText && newText.length > 0) {
    //                 setDataInput((prevData) => [...prevData, newText]);
    //                 if (refInput.current) refInput.current.value = ""; // Clear input
    //             }
    //         } else if (event.key === "Backspace") {
    //             if (dataInput.length > 0 && (!newText || newText.length === 0)) {
    //                 setDataInput((prevData) => prevData.slice(0, -1)); // Remove last item
    //             }
    //         }
    //     };

    //     window.addEventListener("keyup", handleKeyUp);
    //     return () => window.removeEventListener("keyup", handleKeyUp);
    // }, [dataInput]); // Depend only on dataInput

    // const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const value = e.target.value;
    //     setSizeInput(value.trim().length > 0 ? value.length : 1); // Adjust size based on input
    // };

    const handleDelItem = (index: number) => {
        setDataInput((prevData) => prevData.filter((_, i) => i !== index)); // Remove item by index
    };

    return (
        <div className='wrap'>
            {/* <Flex align="center" onClick={() => refInput.current?.focus()}> */}
            <Flex>
                <Box p={3}>
                    {dataInput.map((text, i) => (
                        <Tag
                            key={`${i}_${text}`}
                            colorScheme="blackAlpha"
                            className='item_text'
                        >
                            {text}
                            <TagCloseButton onClick={() => handleDelItem(i)} />
                        </Tag>
                    ))}
                    <input
                        // ref={refInput}
                        // onChange={handleChangeInput}
                        className='input'
                        // size={sizeInput}
                    />
                </Box>
            </Flex>
        </div>
    );
}
