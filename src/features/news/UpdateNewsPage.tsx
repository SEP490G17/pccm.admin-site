import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import "./style.scss";
import { Form, Formik } from "formik";
import { FaEdit } from "react-icons/fa";
import { useStore } from "@/app/stores/store";
import React, { useEffect, useState } from "react";
import { News, NewsDTO } from "@/app/models/news.models";
import * as Yup from 'yup';
import TextFieldAtoms from "@/app/common/form/TextFieldAtoms";
import TagFieldAtom from "@/app/common/form/TagFieldAtom";
import FileUploadFieldAtoms from "@/app/common/form/FileUploadFieldAtoms";
import TimeInputAtom from "@/app/common/form/TimeInputAtom";
import ReactQuillAtom from "@/app/common/form/ReactQuillAtom";
import { dateFormatOptions } from "@/app/helper/settings";

interface UpdateNewsPageProps {
  newsId: number;
}

const UpdateNewsPage: React.FC<UpdateNewsPageProps> = ({ newsId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { newsStore } = useStore();
  const { detailNews } = newsStore;
  const [newsSelected, setNewsSelected] = useState<News>();
  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Tiêu đề bài viết không được bỏ trống'),
    tags: Yup.array().required('Tag không được bỏ trống'),
    description: Yup.string().required('Mô tả không được bỏ trống'),
    thumbnail: Yup.string().required('Ảnh banner không được bỏ trống'),
    startTime: Yup.string().required('Giờ bắt đầu không được bỏ trống'),
    endTime: Yup.string().required('Giờ kết thúc không được bỏ trống'),
    content: Yup.string().required('Chi tiết bài viết không được bỏ trống'),
  });
  const AxiosNewsDetail = async () => {
    const data = await detailNews(newsId);
    setNewsSelected(data);
  };

  useEffect(() => {
    AxiosNewsDetail();
  }, [newsId]);

  return (
    <>
      <IconButton
        icon={<FaEdit />}
        aria-label="Edit"
        colorScheme="teal"
        size="sm"
        mr={2}
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent width="1164px" flexShrink="0" borderRadius="20px" bg="#FFF">
          <ModalHeader bg="#00423D" color="white" borderRadius="20px 20px 0 0">
            Cập nhật bài viết
          </ModalHeader>
          <ModalCloseButton color='#FFF' />
          <ModalBody>
            <VStack spacing="20px" align="stretch">
              <Formik
                initialValues={{
                  thumbnail: newsSelected?.thumbnail || "",
                  title: newsSelected?.title || "",
                  description: newsSelected?.description || "",
                  startTime: newsSelected?.startTime || "",
                  endTime: newsSelected?.endTime || "",
                  location: newsSelected?.location || "",
                  status: newsSelected?.status || "",
                  tags: newsSelected?.tags || [],
                  createdAt: newsSelected?.createdAt || "",
                  content: newsSelected?.content || "",
                }}
                onSubmit={async (values) => {
                  console.error(values)
                  const News = new NewsDTO({
                    title: values.title,
                    description: values.description,
                    tags: values.tags,
                    thumbnail: values.thumbnail,
                    startTime: values.startTime,
                    endTime: values.endTime,
                    location: values.location,
                    content: values.content,
                    createAt: new Date().toLocaleString('vi-VN', dateFormatOptions).trim(),
                    status: 1
                  });
                  await newsStore.updateNews(News, newsId);
                  onClose()
                }}
                validationSchema={validationSchema}
              >
                {({ handleSubmit, isSubmitting, isValid, errors }) => {
                  // Logging để kiểm tra isValid và errors
                  console.log('Is Valid:', isValid);
                  console.log('Errors:', errors);

                  return (
                    <Form onSubmit={handleSubmit}>
                      <TextFieldAtoms
                        isRequired={true}
                        label="Tiêu đề bài viết"
                        className="input_text"
                        type="text"
                        name="title"
                        placeholder="Nhập" />

                      <TextFieldAtoms
                        isRequired={true}
                        label="Mô tả"
                        className="input_text"
                        type="text"
                        name="description"
                        placeholder="Nhập" />

                      <HStack>
                        <TextFieldAtoms
                          isRequired={true}
                          label="Địa điểm"
                          className="input_text"
                          type="text"
                          name="location"
                          placeholder="Nhập" />

                        <TagFieldAtom name="tags" label="Tags bài viết" isRequired={false}></TagFieldAtom>

                      </HStack>

                      <FileUploadFieldAtoms
                        label="Ảnh banner"
                        limit={1}
                        name="thumbnail"
                        isRequired={true}
                        imageUrl={newsSelected?.thumbnail}
                      />

                      <FormControl>
                        <FormLabel className="title_label">Thời gian</FormLabel>
                        <HStack spacing="20px">
                          <TimeInputAtom color='green' label='Giờ bắt đầu' type='datetime-local' name='startTime'></TimeInputAtom>
                          <TimeInputAtom color='red' label='Giờ kết thúc' type='datetime-local' name='endTime'></TimeInputAtom>
                        </HStack>
                      </FormControl>

                      <ReactQuillAtom name="content" label="Chi tiết bài viết" isRequired={true}></ReactQuillAtom>

                      <Stack direction='row' justifyContent='flex-end'>
                        <Button
                          disabled={isSubmitting || !isValid}
                          className="save"
                          isLoading={isSubmitting}
                          type="submit"
                        >
                          Lưu
                        </Button>
                      </Stack>
                    </Form>
                  )
                }
                }
              </Formik>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateNewsPage;
