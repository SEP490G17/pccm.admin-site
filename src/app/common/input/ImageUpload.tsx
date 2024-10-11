import React, { useRef, useState } from "react";
import {
    Box,
    Button,
    Flex,
    Image,
    Input,
    InputProps,
    Text,
} from "@chakra-ui/react";
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

    return (
        <Box display="flex" alignItems="flex-end">
            <Box display='flex'>
                {imagePreviews.length > 0 && (
                    imagePreviews.map((src, index) => (
                        <Image className="image_court"
                            key={index}
                            src={src}
                            alt={`preview-${index}`}
                            mr='1rem'
                        />
                    ))
                )}
            </Box>
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
        </Box>
    );
};

export default ImageUpload;
