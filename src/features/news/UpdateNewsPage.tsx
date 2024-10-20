import {
  Badge,
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import "./style.scss";
import { Form, Formik } from "formik";
import InputTag from "@/app/common/input/InputTag";
import FileUpload from "@/app/common/input/FileUpload";
import SelectComponent from "@/app/common/input/Select";
import ReactQuillComponent from "@/app/common/input/ReactQuill";
import { FaEdit } from "react-icons/fa";
import { useStore } from "@/app/stores/store";
import React, { useEffect, useState } from "react";
import { News } from "@/app/models/news.models";

interface UpdateNewsPageProps {
  newsId: number;
}

const UpdateNewsPage: React.FC<UpdateNewsPageProps> = ({ newsId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { newsStore } = useStore();
  const { detailNews } = newsStore;
  const [newsSelected, setNewsSelected] = useState<News | undefined>(undefined);
  const AxiosNewsDetail = async () => {
    const data = await detailNews(newsId);
    setNewsSelected(data);
  };
  useEffect(() => {
    AxiosNewsDetail();
  }, []);
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
                  createAt: newsSelected?.createdAt || "",
                }}
                onSubmit={(values) => {
                  console.log(values);
                  // Handle the submit logic here
                }}
              >
                {(props) => (
                  <Form>
                    <FormControl isRequired>
                      <FormLabel className="title_label">
                        Tiêu đề bài viết
                      </FormLabel>
                      <Input
                        className="input_text"
                        type="text"
                        name="title"
                        placeholder="Nhập"
                        value={props.values.title}
                        onChange={props.handleChange}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel className="title_label">Mô tả</FormLabel>
                      <Textarea
                        name="description"
                        placeholder="Mô tả"
                        className="input_text"
                        value={props.values.description}
                        onChange={props.handleChange}
                      />
                    </FormControl>

                    <HStack>
                      <FormControl>
                        <FormLabel className="title_label">
                          Danh mục bài viết
                        </FormLabel>
                        <SelectComponent items={[{ id: 1, name: 'Pickerball' }, { id: 2, name: 'FPT' }]} onSelectChange={props.handleChange} categoryValue={"FPT"} />
                      </FormControl>
                      <FormControl>
                        <FormLabel className="title_label">
                          Tag bài viết
                        </FormLabel>
                        <InputTag tags={props.values.tags} />
                      </FormControl>
                    </HStack>

                    <FormControl>
                      <FormLabel className="title_label">
                        Ảnh banner
                      </FormLabel>
                      <FileUpload name="images" ImageUrl={props.values.thumbnail ? [props.values.thumbnail] : []} />
                    </FormControl>

                    <FormControl>
                      <FormLabel className="title_label">Thời gian</FormLabel>
                      <HStack spacing="20px">
                        <Badge colorScheme="green" fontSize="1em" padding="8px 16px">
                          Giờ bắt đầu
                        </Badge>
                        <Input
                          type="datetime-local"
                          name="startDate"
                          bg="#FFF"
                          width="200px"
                          value={props.values.startTime}
                          onChange={props.handleChange}
                        />

                        <Badge colorScheme="red" fontSize="1em" padding="8px 16px">
                          Giờ kết thúc
                        </Badge>
                        <Input
                          type="datetime-local"
                          name="endDate"
                          bg="#FFF"
                          width="200px"
                          value={props.values.endTime}
                          onChange={props.handleChange}
                        />
                      </HStack>
                    </FormControl>

                    <FormLabel className="title_label">
                      Chi tiết bài viết
                    </FormLabel>
                    <Box>
                      <Box mb='7rem'>
                        <ReactQuillComponent />
                      </Box>
                      <Stack direction='row' justifyContent='flex-end'>
                        <Button
                          className="delete"
                          isLoading={props.isSubmitting}
                          type="button"
                        >
                          Xóa
                        </Button>
                        <Button
                          className="save"
                          isLoading={props.isSubmitting}
                          type="submit"
                        >
                          Lưu
                        </Button>
                      </Stack>
                    </Box>
                  </Form>
                )}
              </Formik>
            </VStack>
          </ModalBody>

        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateNewsPage;
