import React, { useRef, useState } from "react";
import {
    Box,
    Button,
    Flex,
    FormControl,
    IconButton,
    Input,
    InputProps,
    Text,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

interface FileUploadProps extends InputProps {
    name?: string;
    ImageUrl?: string[];
}

const FileUpload: React.FC<FileUploadProps> = (props) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [fileNames, setFileNames] = useState<string[]>(props.ImageUrl || []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newNames = Array.from(files).map(file => file.name);
            setFileNames((prevNames) => [...prevNames, ...newNames]);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files) {
            const newNames = Array.from(files).map(file => file.name);
            setFileNames((prevNames) => [...prevNames, ...newNames]);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleRemoveFile = (index: number, event: React.MouseEvent) => {
        event.stopPropagation();
        setFileNames((prevNames) => prevNames.filter((_, i) => i !== index));
    };

    return (
        <FormControl>
            <Box
                className="box_banner"
                onClick={() => inputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <Flex alignItems="center" justifyContent='space-between' alignSelf='stretch'>
                    {fileNames.length === 0 && <Text className="text_upload">Kéo hình ảnh hoặc up load hình ảnh tại đây</Text>}
                    {fileNames.length > 0 && (
                        <Box mt={2}>
                            {fileNames.map((name, index) => (
                                <Flex mb={2} key={index}>
                                    <Text className="text_upload">{name}</Text>
                                    <IconButton
                                        aria-label="Remove file"
                                        icon={<CloseIcon boxSize={2} />}
                                        size="xs"
                                        colorScheme="red"
                                        onClick={(event) => handleRemoveFile(index, event)}
                                        ml={2}
                                    />
                                </Flex>
                            ))}
                        </Box>
                    )}
                    <Button className="upload_file">
                        Upload File
                    </Button>
                </Flex>
            </Box>
            <Input
                name={props.name}
                type="file"
                id="file-upload"
                ref={inputRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple
                display="none"
            />
        </FormControl>
    );
};

export default FileUpload;
