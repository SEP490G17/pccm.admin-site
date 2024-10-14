import React, { useRef, useState } from "react";
import {
    Box,
    Button,
    Flex,
    IconButton,
    Image,
    Input,
    InputProps,
    Text,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
// import { CloseIcon } from "@chakra-ui/icons";
interface ImageUploadProps extends InputProps {
    name?: string;
}
const ImageUpload: React.FC<ImageUploadProps> = (props) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newPreviews = Array.from(files).map(file =>
                URL.createObjectURL(file)
            );
            setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files) {
            const newPreviews = Array.from(files).map(file =>
                URL.createObjectURL(file)
            );
            setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const removeImage = (indexToRemove: number) => {
        setImagePreviews((prevPreviews) =>
        (
            prevPreviews.filter((_, index) => index !== indexToRemove)
        )
        );
    };

    return (
        <Box display="flex" alignItems="flex-end">
            <Flex wrap="wrap" gap="1rem">
                {imagePreviews.length > 0 &&
                    imagePreviews.map((src, index) => (
                        <Box
                            key={index}
                            position="relative"
                            flexBasis="calc(25% - 0rem)"
                            minW='15.625rem'
                        >
                            <Image
                                className="image_court"
                                src={src}
                                alt={`preview-${index}`}
                                objectFit="cover"
                            />
                            <IconButton
                                size="sm"
                                icon={<CloseIcon />}
                                aria-label="Remove image"
                                position="absolute"
                                top="0"
                                right="0"
                                onClick={() => removeImage(index)}
                            />
                        </Box>
                    ))}
                <Box className="box_court"
                    onClick={() => inputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <Flex direction='column' alignItems="center" justifyContent='space-between' alignSelf='stretch'>
                        <Button className="upload_file" mb='1rem'>
                            Upload File
                        </Button>
                        <Text className="text_upload" justifyContent='center'>Upload hình ảnh tại đây</Text>
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
            </Flex>
        </Box>
    );
};

export default ImageUpload;
