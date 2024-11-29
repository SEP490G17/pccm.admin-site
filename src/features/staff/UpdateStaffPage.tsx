import {
  Button,
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
  Skeleton,
  Stack,
  VStack,
} from '@chakra-ui/react';
import './style/style.scss';
import { Form, Formik, Field } from 'formik';
import TextFieldAtoms from '@/app/common/form/TextFieldAtoms';
import Select from 'react-select';
import { useStore } from '@/app/stores/store';
import { useEffect } from 'react';
import * as Yup from 'yup';
import { UpdateStaffDTO } from '@/app/models/user.model';
import { observer } from 'mobx-react-lite';
import NumberFieldAtom from '@/app/common/form/NumberFieldAtoms';

interface IProp {
  isOpen: boolean;
  onClose: () => void;
}

const UpdateStaffPage = ({ isOpen, onClose }: IProp) => {
  const { staffPositionStore, courtClusterStore, staffStore } = useStore();
  const { StaffPositionArray } = staffPositionStore;
  const { courtClusterListAllOptions } = courtClusterStore;
  const { selectedStaffEdit } = staffStore;
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('Họ không được bỏ trống'),
    lastName: Yup.string().required('Tên không được bỏ trống'),
    username: Yup.string().required('Tên đăng nhập không được bỏ trống'),
    email: Yup.string().email('Email không hợp lệ').required('Email không được bỏ trống'),
    phonenumber: Yup.string()
      .matches(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ')
      .required('Số điện thoại không được bỏ trống'),
    position: Yup.object().nullable().required('Chức vụ không được bỏ trống'),
    courtcluster: Yup.array().min(1, 'Vui lòng chọn ít nhất một cụm sân').required('Cụm sân không được bỏ trống'),
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
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent width="1164px" flexShrink="0" borderRadius="20px" bg="#FFF">
          <ModalHeader bg="#00423D" color="white" borderRadius="20px 20px 0 0">
            Cập Nhật Nhân Viên
          </ModalHeader>
          <ModalCloseButton color="#FFF" />
          <ModalBody>
            <Skeleton isLoaded={!staffStore.loadingEdit}>
              <VStack spacing="20px" align="stretch">
                <Formik
                  initialValues={{
                    firstName: selectedStaffEdit?.firstName ?? '',
                    lastName: selectedStaffEdit?.lastName ?? '',
                    username: selectedStaffEdit?.userName ?? '',
                    email: selectedStaffEdit?.email ?? '',
                    phonenumber: selectedStaffEdit?.phoneNumber ?? '',
                    position: positionOptions.find((item) => item.value === Number(selectedStaffEdit?.position)) ?? positionOptions[0],
                    courtcluster: courtClusterListAllOptions.filter(option =>
                      selectedStaffEdit?.courtCluster.includes(option.value)) ?? [],
                  }}
                  enableReinitialize
                  validationSchema={validationSchema}
                  onSubmit={async (values) => {
                    const data = new UpdateStaffDTO({
                      staffDetailId: selectedStaffEdit?.id,
                      courtCluster: values.courtcluster.map(item => item.value),
                      phoneNumber: values.phonenumber,
                      email: values.email,
                      firstName: values.firstName,
                      lastName: values.lastName,
                      userName: values.username,
                      positionId: values.position.value
                    })
                    try {
                      await staffStore.updateStaff(data, onClose)
                    } catch (error) {
                      console.error("Failed to edit staff:", error);
                    }
                  }}
                >
                  {({ handleSubmit, isSubmitting }) => {
                    return (
                      <Form onSubmit={handleSubmit}>
                        <Flex gap={3} justifyContent={'space-between'}>
                          <TextFieldAtoms label="Họ" isRequired={true} placeholder="Nhập" name="firstName" />
                          <TextFieldAtoms label="Tên" isRequired={true} placeholder="Nhập" name="lastName" />
                        </Flex>
                        <TextFieldAtoms label="Tên đăng nhập" isRequired={true} placeholder="Nhập" name="username" />
                        <Flex gap={3} justifyContent={'space-between'}>
                          <TextFieldAtoms label="Email" isRequired={true} placeholder="Nhập" name="email" type='email' />
                          <NumberFieldAtom label="Số điện thoại" isRequired={true} placeholder="Nhập" name="phonenumber" type='tel' />
                        </Flex>
                        <Flex gap={3}>
                          <FormControl>
                            <FormLabel className="title_label">Chức vụ</FormLabel>
                            <Field name="position">
                              {({ field, form }) => (
                                <Select
                                  {...field}
                                  options={positionOptions}
                                  onChange={(option) => form.setFieldValue('position', option)}
                                  isSearchable={true}
                                  value={form.values.position}
                                />
                              )}
                            </Field>
                          </FormControl>
                          <FormControl>
                            <FormLabel className="title_label">Làm việc ở cụm sân</FormLabel>
                            <Field name="courtcluster">
                              {({ field, form }) => (
                                <Select
                                  {...field}
                                  menuShouldScrollIntoView={false}
                                  menuPlacement="top"
                                  closeMenuOnSelect={true}
                                  isMulti
                                  options={courtClusterListAllOptions}
                                  placeholder="Chọn"
                                  value={form.values.courtcluster}
                                  onChange={(options) => {
                                    form.setFieldValue('courtcluster', options);
                                  }}
                                />
                              )}
                            </Field>
                          </FormControl>
                        </Flex>
                        <Stack direction="row" justifyContent="flex-end" mt={9}>
                          <Button className="save" disabled={isSubmitting} isLoading={isSubmitting} type="submit">
                            Cập nhật
                          </Button>
                        </Stack>
                      </Form>
                    )
                  }}
                </Formik>
              </VStack>
            </Skeleton>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default observer(UpdateStaffPage);
