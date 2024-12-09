import {
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
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
} from '@chakra-ui/react';
import './style/style.scss';
import { Form, Formik, Field } from 'formik';
import MultiSelectData from '@/app/common/input/MultiSelectData';
import TextFieldAtoms from '@/app/common/form/TextFieldAtoms';
import Select from 'react-select';
import { useStore } from '@/app/stores/store';
import { useEffect } from 'react';
import * as Yup from 'yup';
import NumberFieldAtom from '@/app/common/form/NumberFieldAtoms';
import { CreateStaffDTO } from '@/app/models/user.model';
import { observer } from 'mobx-react-lite';
import ButtonPrimaryAtoms from '../atoms/ButtonPrimaryAtoms';
import PlusIcon from '../atoms/PlusIcon';

const CreateStaffPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { staffPositionStore, courtClusterStore, staffStore } = useStore();
  const { StaffPositionArray } = staffPositionStore;
  const { courtClusterListAllOptions } = courtClusterStore;
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('Họ không được bỏ trống'),
    lastName: Yup.string().required('Tên không được bỏ trống'),
    username: Yup.string().required('Tên đăng nhập không được bỏ trống'),
    email: Yup.string().email('Email không hợp lệ').required('Email không được bỏ trống'),
    phonenumber: Yup.string()
      .matches(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ')
      .required('Số điện thoại không được bỏ trống'),
    password: Yup.string()
      .required('Mật khẩu không được bỏ trống')
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .matches(/[a-z]/, 'Mật khẩu phải chứa ít nhất 1 chữ thường')
      .matches(/[A-Z]/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa')
      .matches(/[0-9]/, 'Mật khẩu phải chứa ít nhất 1 chữ số')
      .matches(/[@$!%*?&]/, 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt'),
    repassword: Yup.string()
      .required('Mật khẩu xác nhận không được bỏ trống')
      .oneOf([Yup.ref('password')], 'Mật khẩu xác nhận không khớp'),
    position: Yup.object().nullable().required('Chức vụ không được bỏ trống'),
    courtcluster: Yup.array()
      .min(1, 'Vui lòng chọn ít nhất một cụm sân')
      .required('Cụm sân không được bỏ trống'),
  });
  const positionOptions = StaffPositionArray.map((position, index) => ({
    value: index + 1,
    label: position.name,
  }));

  useEffect(() => {
    courtClusterStore.loadCourtClusterListAll();
  }, [courtClusterStore]);

  return (
    <>
      <ButtonPrimaryAtoms className="bg-primary-900" handleOnClick={onOpen} >
        <Center gap={1}>
          <PlusIcon color="white" height="1.5rem" width="1.5rem" />
          Thêm mới
        </Center>
      </ButtonPrimaryAtoms>
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent width="1164px" flexShrink="0" borderRadius="20px" bg="#FFF">
          <ModalHeader bg="#00423D" color="white" borderRadius="20px 20px 0 0">
            Thêm Nhân Viên
          </ModalHeader>
          <ModalCloseButton color="#FFF" />
          <ModalBody>
            <VStack spacing="20px" align="stretch">
              <Formik
                initialValues={{
                  firstName: '',
                  lastName: '',
                  username: '',
                  email: '',
                  phonenumber: '',
                  password: '',
                  repassword: '',
                  position: positionOptions[2],
                  courtcluster: [],
                }}
                validationSchema={validationSchema}
                onSubmit={async (values) => {
                  const data = new CreateStaffDTO({
                    courtCluster: values.courtcluster,
                    phoneNumber: values.phonenumber,
                    email: values.email,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    userName: values.username,
                    password: values.password,
                    positionId: values.position.value,
                  });
                  await staffStore.createStaff(data, onClose);
                }}
              >
                {({ handleSubmit, isSubmitting, setFieldValue }) => {
                  return (
                    <Form onSubmit={handleSubmit}>
                      <Flex gap={3} justifyContent={'space-between'}>
                        <TextFieldAtoms
                          label="Họ"
                          isRequired={true}
                          placeholder="Nhập"
                          name="firstName"
                        />
                        <TextFieldAtoms
                          label="Tên"
                          isRequired={true}
                          placeholder="Nhập"
                          name="lastName"
                        />
                      </Flex>
                      <TextFieldAtoms
                        label="Tên đăng nhập"
                        isRequired={true}
                        placeholder="Nhập"
                        name="username"
                      />
                      <Flex gap={3} justifyContent={'space-between'}>
                        <TextFieldAtoms
                          label="Email"
                          isRequired={true}
                          placeholder="Nhập"
                          name="email"
                          type="email"
                        />
                        <NumberFieldAtom
                          label="Số điện thoại"
                          isRequired={true}
                          placeholder="Nhập"
                          name="phonenumber"
                          type="tel"
                        />
                      </Flex>
                      <Flex gap={3} justifyContent={'space-between'}>
                        <TextFieldAtoms
                          label="Mật khẩu"
                          isRequired={true}
                          placeholder="Nhập"
                          name="password"
                          type="password"
                        />
                        <TextFieldAtoms
                          label="Xác nhận mật khẩu"
                          isRequired={true}
                          placeholder="Nhập"
                          name="repassword"
                          type="password"
                        />
                      </Flex>
                      <Flex gap={3}>
                        <FormControl>
                          <FormLabel className="title_label">Chức vụ</FormLabel>
                          <Field name="position">
                            {() => (
                              <Select
                                options={positionOptions}
                                onChange={(option) => setFieldValue('position', option)}
                                isSearchable={true}
                                defaultValue={positionOptions[0]}
                                menuPlacement="top"
                              />
                            )}
                          </Field>
                        </FormControl>
                        <FormControl>
                          <FormLabel className="title_label">Làm việc ở cụm sân</FormLabel>
                          <Field name="courtcluster">
                            {() => (
                              <MultiSelectData
                                items={courtClusterListAllOptions}
                                onChange={(options) => {
                                  const values = options.map((option) => option.value);
                                  setFieldValue('courtcluster', values);
                                }}
                              />
                            )}
                          </Field>
                        </FormControl>
                      </Flex>
                      <Stack direction="row" justifyContent="flex-end" mt={9}>
                        <Button className="save" isLoading={isSubmitting} type="submit">
                          Thêm
                        </Button>
                      </Stack>
                    </Form>
                  );
                }}
              </Formik>
            </VStack>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default observer(CreateStaffPage);
