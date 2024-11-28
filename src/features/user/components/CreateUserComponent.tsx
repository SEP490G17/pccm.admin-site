import {
    Button,
    Flex,
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
import "../style/style.scss";
import * as Yup from 'yup';
import { Form, Formik } from "formik";
import { FaEdit } from "react-icons/fa";
import TextFieldAtoms from "@/app/common/form/TextFieldAtoms";
import NumberFieldAtom from "@/app/common/form/NumberFieldAtoms";
import { CreateUserDTO } from "@/app/models/user.model";
import { useStore } from "@/app/stores/store";

const CreateUserComponent = () => {
    const {userStore} = useStore()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const validationSchema = Yup.object().shape({
        userName: Yup.string().required('Tên đăng nhập không được bỏ trống'),
        phoneNumber: Yup.string()
            .matches(/^0\d{9}$/, 'Số điện thoại phải có 10 chữ số và bắt đầu bằng 0')
            .required('Số điện thoại không được bỏ trống'),
        email: Yup.string().required('Email không được bỏ trống'),
        firstName: Yup.string().required('Họ không được bỏ trống'),
        lastName: Yup.string().required('Tên không được bỏ trống'),
        password: Yup.string()
        .required('Mật khẩu không được bỏ trống')
        .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
        .matches(/[a-z]/, 'Mật khẩu phải chứa ít nhất 1 chữ thường')
        .matches(/[A-Z]/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa')
        .matches(/[0-9]/, 'Mật khẩu phải chứa ít nhất 1 chữ số')
        .matches(/[@$!%*?&]/, 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt'),
        rePassword: Yup.string()
            .required('Mật khẩu xác nhận không được bỏ trống')
            .oneOf([Yup.ref('password')], 'Mật khẩu xác nhận không khớp'),
    });
    return (
        <>
            <Button colorScheme="teal" size="md" leftIcon={<FaEdit />} width="149px" height="35px" background="#FFF" color="black" border="1px solid #ADADAD" onClick={onOpen}>
                Thêm mới
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} size="6xl">
                <ModalOverlay />
                <ModalContent width="1164px" flexShrink="0" borderRadius="20px" bg="#FFF">
                    <ModalHeader bg="#00423D" color="white" borderRadius="20px 20px 0 0">
                        Thêm Người Dùng
                    </ModalHeader>
                    <ModalCloseButton color='#FFF' />
                    <ModalBody>
                        <VStack spacing="20px" align="stretch">
                            <Formik
                                initialValues={{
                                    userName: '',
                                    phoneNumber: '',
                                    email: '',
                                    firstName: '',
                                    lastName: '',
                                    password: '',
                                    rePassword: ''
                                }}
                                onSubmit={async (values) => {
                                    const data = new CreateUserDTO({
                                        userName: values.userName,
                                        phoneNumber: values.phoneNumber,
                                        email: values.email,
                                        firstName: values.firstName,
                                        lastName: values.lastName,
                                        password: values.password,
                                    })

                                    await userStore.createUserStaff(data)
                                }}
                                validationSchema={validationSchema}
                            >
                                {(props) => (
                                    <Form>
                                        <TextFieldAtoms
                                            isRequired={true}
                                            label="Tên đăng nhập"
                                            className="input_text"
                                            type="text"
                                            name="userName"
                                            placeholder="Nhập"
                                        />
                                        <Flex gap={5}>
                                            <NumberFieldAtom
                                                isRequired={true}
                                                label="Số điện thoại"
                                                className="input_text"
                                                type="text"
                                                name="phoneNumber"
                                                placeholder="Nhập"
                                            />
                                            <TextFieldAtoms
                                                isRequired={true}
                                                label="Email"
                                                className="input_text"
                                                type="text"
                                                name="email"
                                                placeholder="Nhập"
                                            />
                                        </Flex>
                                        <Flex gap={5}>
                                            <TextFieldAtoms
                                                isRequired={true}
                                                label="Họ"
                                                className="input_text"
                                                type="text"
                                                name="firstName"
                                                placeholder="Nhập"
                                            />
                                            <TextFieldAtoms
                                                isRequired={true}
                                                label="Tên"
                                                className="input_text"
                                                type="text"
                                                name="lastName"
                                                placeholder="Nhập"
                                            />
                                        </Flex>

                                        <Flex gap={5}>
                                            <TextFieldAtoms
                                                isRequired={true}
                                                label="Mật khẩu"
                                                className="input_text"
                                                type="password"
                                                name="password"
                                                placeholder="Nhập"
                                            />
                                            <TextFieldAtoms
                                                isRequired={true}
                                                label="Xác nhận mật khẩu"
                                                className="input_text"
                                                type="password"
                                                name="rePassword"
                                                placeholder="Nhập"
                                            />
                                        </Flex>

                                        <Stack direction='row' justifyContent='flex-end' mt={9}>
                                            <Button
                                                className="save"
                                                isLoading={props.isSubmitting}
                                                type="submit"
                                            >
                                                Tạo
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

export default CreateUserComponent;
