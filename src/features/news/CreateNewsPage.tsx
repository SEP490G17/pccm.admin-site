import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  VStack,
} from "@chakra-ui/react";
import "./style.scss";
import { Form, Formik } from "formik";
import * as Yup from 'yup';
import TextFieldAtoms from "@/app/common/form/TextFieldAtoms";
import FileUploadFieldAtoms from "@/app/common/form/FileUploadFieldAtoms";
import TimeInputAtom from "@/app/common/form/TimeInputAtom";
import { useStore } from "@/app/stores/store";
import { dateFormatOptions } from '@/app/helper/settings';
import TagFieldAtom from "@/app/common/form/TagFieldAtom";
import ReactQuillAtom from "@/app/common/form/ReactQuillAtom";
import { NewsDTO } from "@/app/models/news.models";

interface IProp {
  isOpen: boolean;
  onClose: () => void;
}
const CreateNewsPage = ({ isOpen, onClose }: IProp) => {
  const { newsStore } = useStore();

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Tiêu đề bài viết không được bỏ trống'),
    tags: Yup.array()
    .min(1,'Tag không được bỏ trông')
    .required('Tag không được bỏ trống'),
    description: Yup.string().required('Mô tả không được bỏ trống'),
    thumbnail: Yup.string().required('Ảnh tin tức không được bỏ trống'),
    location: Yup.string().required('Địa điểm không được bỏ trống'),
    startTime: Yup.string().required('Giờ bắt đầu không được bỏ trống'),
    endTime: Yup.string()
      .required('Giờ kết thúc không được bỏ trống')
      .when("startTime", (startTime, schema) => {
        return schema.test({
          name: "is-after-start-time",
          message: "Giờ kết thúc phải sau giờ bắt đầu",
          test: function (value) {
            if (typeof startTime[0] === 'string' && typeof value === 'string') {
              return new Date(value) > new Date(startTime[0]);
            }
            return false;
          },
        });
      }),
    content: Yup.string().required('Chi tiết bài viết không được bỏ trống'),
  });

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent width="1164px" flexShrink="0" borderRadius="20px" bg="#FFF">
          <ModalHeader bg="#00423D" color="white" borderRadius="20px 20px 0 0">
            Thêm bài viết
          </ModalHeader>
          <ModalCloseButton color='#FFF' />
          <ModalBody>
            <VStack spacing="20px" align="stretch">
              <Formik
                initialValues={{
                  title: '',
                  description: '',
                  tags: [],
                  thumbnail: '',
                  startTime: '',
                  location: '',
                  endTime: '',
                  content: ''
                }}
                onSubmit={async (values) => {
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
                  await newsStore.createNews(News);
                  onClose()
                }}
                validationSchema={validationSchema}
              >
                {({ handleSubmit, isSubmitting }) => {
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

                        <TagFieldAtom name="tags" label="Tags bài viết" isRequired={true}></TagFieldAtom>
                      </HStack>

                      <FileUploadFieldAtoms
                        label="Ảnh tin tức"
                        limit={1}
                        name="thumbnail"
                        isRequired={true}
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
                          // disabled={isSubmitting || !isValid}
                          className="save"
                          isLoading={isSubmitting}
                          type="submit"
                        >
                          Tạo
                        </Button>
                      </Stack>
                    </Form>
                  );
                }}
              </Formik>
            </VStack>
          </ModalBody>

          <ModalFooter>
            {/* Nội dung footer nếu cần */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateNewsPage;
