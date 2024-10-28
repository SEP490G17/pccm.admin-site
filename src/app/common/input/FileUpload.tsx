import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputProps,
  Text,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { useField } from 'formik';
import { toast } from 'react-toastify';
import { useStore } from '@/app/stores/store';

interface FileUploadProps extends InputProps {
  name?: string;
  ImageUrl?: string | null;
  limit?: number;
  label?: string;
  value?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  name = 'images',
  limit = 1,
  label,
  value
}: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileNames, setFileNames] = useState<string[]>(value ? [value] : []);
  // Sử dụng useField để lấy field của Formik
  const [, , helpers] = useField(name);
  const { uploadStore } = useStore();
  const { loading, upImage, imageRegistry } = uploadStore;
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {

      if (limit == 1) {
        if (fileNames.length >= limit) {
          toast.error(`Vượt quá số lượng ảnh: ${limit}`);
          return;
        }
        const check = imageRegistry.get(files[0].name);
        if (!check) {
          setFileNames([files[0].name]);
          await upImage(files[0], files[0].name);
        }
        helpers.setValue(imageRegistry.get(files[0].name)?.url);
        setFileNames([imageRegistry.get(files[0].name)?.url ?? ""]);
      } else {
        const upFiles = Array.from(files);
        const totalFiles = fileNames.length + upFiles.length;

        if (totalFiles > limit) {
          toast.error(`Vượt quá số lượng ảnh: ${limit}`);
          upFiles.length = limit - fileNames.length;
        }
        await Promise.all(upFiles.map((file) => upImage(file, file.name)));

        const updatedFileNames = [...fileNames, ...upFiles.map((file) => file.name)];
        const urls = [updatedFileNames.map((name) => imageRegistry.get(name)?.url)];
        setFileNames(updatedFileNames);
        helpers.setValue([urls]);
      }
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files) {

      if (limit == 1) {
        if (fileNames.length >= limit) {
          toast.error(`Vượt quá số lượng ảnh: ${limit}`);
          return;
        }
        const check = imageRegistry.get(files[0].name);
        if (!check) {
          setFileNames([files[0].name]);
          await upImage(files[0], files[0].name);
        }
        helpers.setValue(imageRegistry.get(files[0].name)?.url);
      } else {
        const upFiles = Array.from(files);
        const totalFiles = fileNames.length + upFiles.length;

        if (totalFiles > limit) {
          toast.error(`Vượt quá số lượng ảnh: ${limit}`);
          upFiles.length = limit - fileNames.length;
        }
        await Promise.all(upFiles.map((file) => upImage(file, file.name)));

        const updatedFileNames = [...fileNames, ...upFiles.map((file) => file.name)];
        const urls = [updatedFileNames.map((name) => imageRegistry.get(name)?.url)];
        setFileNames(updatedFileNames);
        helpers.setValue([urls]);
      }
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleRemoveFile = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const updatedNames = fileNames.filter((_, i) => i !== index);
    setFileNames(updatedNames);
    helpers.setValue(updatedNames);
    const removedFileName = fileNames[index];
    imageRegistry.delete(removedFileName); // Cập nhật giá trị cho Formik
    event.preventDefault();
  };

  return (
    <FormControl>
      <FormLabel className="title_label">{label}</FormLabel>

      <Box
        className="box_banner"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <Flex alignItems="center" justifyContent="space-between" alignSelf="stretch">
          {fileNames.length === 0 && (
            <Text className="text_upload">Kéo hình ảnh hoặc upload hình ảnh tại đây</Text>
          )}
          {fileNames.length > 0 && (
            <Box mt={2} width={'80%'}>
              {fileNames.map((name, index) => (
                <Flex mb={2} key={index} alignItems={'center'}>
                  <Text className="text_upload" whiteSpace={'wrap'} width={'100%'}>{name}</Text>
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
          <Button disabled={loading} isLoading={loading} className="upload_file">
            Upload File
          </Button>
        </Flex>
      </Box>
      <Input
        type="file"
        id="file-upload"
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple={limit !== 1}
        display="none"
      />
    </FormControl>
  );
};

export default FileUpload;
