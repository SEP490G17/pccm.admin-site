import {
    Badge,
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
import MultiSelectData from "@/app/common/input/MultiSelectData";
import { FaEdit } from "react-icons/fa";

const CreateStaffPage = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const courts = [
        { name: 'Cụm sân 1', value: 'cum_san_1' },
        { name: 'Cụm sân 2', value: 'cum_san_2' },
        { name: 'Cụm sân 3', value: 'cum_san_3' },
    ]
    const roles = [
        { name: "Nhặt bóng", value: 1 }, 
        { name: "Quản lý booking", value: 2 }
    ]
    return (
        <>
            <Button colorScheme="teal" size="md" leftIcon={<FaEdit />} width="149px" height="35px" background="#FFF" color="black" border="1px solid #ADADAD" onClick={onOpen}>
                        Thêm mới
                    </Button>

            <Modal isOpen={isOpen} onClose={onClose} size="6xl">
                <ModalOverlay />
                <ModalContent width="1164px" flexShrink="0" borderRadius="20px" bg="#FFF">
                    <ModalHeader bg="#00423D" color="white" borderRadius="20px 20px 0 0">
                        Thêm Nhân Viên
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
                                                Tên nhân viên
                                            </FormLabel>
                                            <Input
                                                className="input_text"
                                                type="text"
                                                name="name"
                                                placeholder="Nhập"
                                            />
                                        </FormControl>
                                        <HStack>
                                            <FormControl>
                                                <FormLabel className="title_label">Căn cước công dân</FormLabel>
                                                <Input
                                                    name="cccd"
                                                    placeholder="Nhập CCCD"
                                                    type="number"
                                                    maxLength={12}
                                                    variant="outline"
                                                />
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel className="title_label">
                                                    Số điện thoại
                                                </FormLabel>
                                                <Input
                                                    name="sdt"
                                                    placeholder="xxxxxxx"
                                                    className="input_text"
                                                    type="number"
                                                />
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel className="title_label">
                                                    Lương ( VND )
                                                </FormLabel>
                                                <Input
                                                    name="salary"
                                                    placeholder="xxxxxxx"
                                                    className="input_text"
                                                    type="number"
                                                />
                                            </FormControl>
                                        </HStack>
                                        <HStack>
                                            <FormControl width='205%'>
                                                <FormLabel className="title_label">
                                                    Chức vụ
                                                </FormLabel>
                                                <Input
                                                    name="position"
                                                    placeholder="Nhập chức vụ"
                                                    className="input_text"
                                                    type="text"
                                                />
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel className="title_label">
                                                    Quyền
                                                </FormLabel>
                                                <MultiSelectData items={roles}></MultiSelectData>
                                            </FormControl>
                                        </HStack>
                                        <HStack>
                                            <FormControl>
                                                <FormLabel className="title_label">
                                                    Ca làm việc
                                                </FormLabel>
                                                <Input
                                                    name="position"
                                                    placeholder="Tên ca"
                                                    className="input_text"
                                                    type="text"
                                                />
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel className="title_label">ㅤ</FormLabel>
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
                                        </HStack>
                                        <FormControl>
                                            <FormLabel className="title_label">
                                                Làm việc ở cụm sâm
                                            </FormLabel>
                                            <MultiSelectData items={courts} />
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

export default CreateStaffPage;
