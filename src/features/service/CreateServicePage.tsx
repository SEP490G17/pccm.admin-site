import {
    Button,
    FormControl,
    FormLabel,
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
import MultiSelectData from "@/app/common/input/MultiSelectData";

const CreateServicePage = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const courts = [
        { name: 'Cụm sân 1', value: 'cum_san_1' },
        { name: 'Cụm sân 2', value: 'cum_san_2' },
        { name: 'Cụm sân 3', value: 'cum_san_3' },
    ]
    return (
        <>
            <Button
                colorScheme="teal"
                size="md"
                onClick={onOpen}
                sx={{
                    display: 'flex',
                    width: '182px',
                    height: '40px',
                    padding: '10.078px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10.078px',
                    borderRadius: '8.063px',
                    background: '#00423D',
                    color: '#FFF',
                    fontFamily: 'Roboto',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: '500',
                    lineHeight: 'normal',
                }}
            >
                Thêm bài viết
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} size="6xl">
                <ModalOverlay />
                <ModalContent width="1164px" flexShrink="0" borderRadius="20px" bg="#FFF">
                    <ModalHeader bg="#00423D" color="white" borderRadius="20px 20px 0 0">
                        Thêm Dịch Vụ
                    </ModalHeader>
                    <ModalCloseButton color='#FFF' />
                    <ModalBody>
                        <VStack spacing="20px" align="stretch">
                            <Formik
                                initialValues={{ name: "", description: "" }}
                                onSubmit={(values) => {
                                    // handleSubmit(values);
                                    console.log(values);
                                }}
                            >
                                {(props) => (
                                    <Form>

                                        <FormControl isRequired>
                                            <FormLabel className="title_label">
                                                Tên dịch vụ
                                            </FormLabel>
                                            <Input
                                                className="input_text"
                                                type="text"
                                                name="service-name"
                                                placeholder="Nhập tên"
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel className="title_label">
                                                Mô tả dịch vụ
                                            </FormLabel>
                                            <Input
                                                className="input_text"
                                                type="text"
                                                name="description"
                                                placeholder="Nhập mô tả"
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel className="title_label">
                                                Giá cả
                                            </FormLabel>
                                            <Input
                                                className="input_text"
                                                type="text"
                                                name="price"
                                                placeholder="xxxxxxx"
                                            />
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel className="title_label">
                                                Thuộc cụm sân
                                            </FormLabel>
                                            <MultiSelectData items={courts}/>
                                        </FormControl>
                                        <Stack direction='row' justifyContent='flex-end' mt={9}>
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

export default CreateServicePage;
