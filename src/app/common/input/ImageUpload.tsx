import React, { useState } from 'react';
import { Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import ImgCrop from 'antd-img-crop';
import { useField } from 'formik';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
interface IProps {
  name: string;
  limit: number;
  initialFileList?: UploadFile[];
}
const ImageUpload = ({ initialFileList = [], name, limit }: IProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>(initialFileList);
  const [, , helpers] = useField(name);
  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    const urls = newFileList
      .map((file) => {
        if (file.status === 'done' && file.response) {
          return file.response.url;
        }
        return file.url;
      })
      .filter((url) => url);
    helpers.setValue(urls);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <>
    
    <ImgCrop
      rotationSlider
      aspect={16 / 9}
    >
      <Upload
        action={`${import.meta.env.VITE_API_URL}upload`}
        listType="picture-card"
        fileList={fileList}
        onChange={onChange}
        onPreview={onPreview}
      >
        {fileList.length < limit && '+ Upload'}
      </Upload>
      
    </ImgCrop>
    
    </>
    
  );
};

export default ImageUpload;
