import {
  Badge,
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
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
const CreateNewsPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button colorScheme="teal" size="md" leftIcon={<FaEdit />} width="149px" height="35px" background="#FFF" color="black" border="1px solid #ADADAD" onClick={onOpen}>
        Thêm mới
      </Button>

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
                initialValues={{ title: "", description: "" }}
                onSubmit={(values) => {
                  // handleSubmit(values);
                  console.log(values);
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
                        onChange={props.handleChange}
                        placeholder="Nhập"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel className="title_label">Mô tả</FormLabel>
                      <Input
                        name="description"
                        placeholder="Mô tả"
                        className="input_text"
                        type="text"
                      />
                    </FormControl>

                    <HStack>
                      <FormControl>
                        <FormLabel className="title_label">
                          Danh mục bài viết
                        </FormLabel>
                        <SelectComponent items={[{ id: 1, name: 'Pickleball' }, { id: 2, name: 'FPT' }]} onSelectChange={(value) => console.log('Selected value:', value)}>
                        </SelectComponent>
                      </FormControl>
                      <FormControl>
                        <FormLabel className="title_label">
                          Tag bài viết
                        </FormLabel>
                        <InputTag />
                      </FormControl>
                    </HStack>

                    <FormControl>
                      <FormLabel className="title_label">
                        Ảnh banner
                      </FormLabel>
                      <FileUpload name="images"></FileUpload>
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
                          //onChange={handleChange}
                          bg="#FFF"
                          width="200px"
                        />

                        <Badge colorScheme="red" fontSize="1em" padding="8px 16px">
                          Giờ kết thúc
                        </Badge>
                        <Input
                          type="datetime-local"
                          name="endDate"
                          //onChange={handleChange}
                          bg="#FFF"
                          width="200px"
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
                          type="submit"
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

          <ModalFooter>

          </ModalFooter>
        </ModalContent>
      </Modal>
    </ >
  );
};

export default CreateNewsPage;
