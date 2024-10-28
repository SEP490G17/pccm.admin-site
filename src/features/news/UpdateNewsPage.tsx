import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Stack,
  VStack,
} from "@chakra-ui/react";
import "./style.scss";
import { Form, Formik } from "formik";
import { useStore } from "@/app/stores/store";
import { NewsDTO } from "@/app/models/news.models";
import * as Yup from 'yup';
import TextFieldAtoms from "@/app/common/form/TextFieldAtoms";
import TagFieldAtom from "@/app/common/form/TagFieldAtom";
import FileUploadFieldAtoms from "@/app/common/form/FileUploadFieldAtoms";
import TimeInputAtom from "@/app/common/form/TimeInputAtom";
import ReactQuillAtom from "@/app/common/form/ReactQuillAtom";
import { dateFormatOptions } from "@/app/helper/settings";
import { observer } from "mobx-react";

interface IProp {
  isOpen: boolean;
  onClose: () => void;
}

const UpdateNewsPage = ({ isOpen, onClose }: IProp) => {
  const { newsStore } = useStore();
  const { selectedNews } = newsStore;
  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Tiêu đề bài viết không được bỏ trống'),
    tags: Yup.array().required('Tag không được bỏ trống'),
    description: Yup.string().required('Mô tả không được bỏ trống'),
    thumbnail: Yup.string().required('Ảnh banner không được bỏ trống'),
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
            Cập nhật bài viết
          </ModalHeader>
          <ModalCloseButton color='#FFF' />
          <ModalBody>
            <VStack spacing="20px" align="stretch">
              <Skeleton isLoaded={!newsStore.isLoadingEdit}>
                <Formik
                  initialValues={{
                    thumbnail: selectedNews?.thumbnail || "",
                    title: selectedNews?.title || "",
                    description: selectedNews?.description || "",
                    startTime: selectedNews?.startTime || "",
                    endTime: selectedNews?.endTime || "",
                    location: selectedNews?.location || "",
                    status: selectedNews?.status || "",
                    tags: selectedNews?.tags || [],
                    createdAt: selectedNews?.createdAt || "",
                    content: selectedNews?.content || "",
                  }}
                  onSubmit={async (values) => {
                    console.error(values)
                    const News = new NewsDTO({
                      id: selectedNews?.id,
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
                    await newsStore.updateNews(News);
                    onClose()
                  }}
                  validationSchema={validationSchema}
                >
                  {({ handleSubmit, isSubmitting, isValid }) => {
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
              </Skeleton>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default observer(UpdateNewsPage);
