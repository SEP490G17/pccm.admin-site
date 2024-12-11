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
  useToast,
  VStack,
} from '@chakra-ui/react';
import './style/style.scss';
import { Form, Formik, Field } from 'formik';
import TextFieldAtoms from '@/app/common/form/TextFieldAtoms';
import Select from 'react-select';
import { useStore } from '@/app/stores/store';
import { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { UpdateStaffDTO } from '@/app/models/user.model';
import { observer } from 'mobx-react-lite';
import NumberFieldAtom from '@/app/common/form/NumberFieldAtoms';

interface IProp {
  isOpen: boolean;
  onClose: () => void;
}

const UpdateStaffPage = observer(({ isOpen, onClose }: IProp) => {
  const { staffPositionStore, courtClusterStore, staffStore } = useStore();
  const [roleOptions, setRoleOptions] = useState<string[]>([]);
  const { staffRoles, StaffPositionArray, loadRoles } = staffPositionStore;
  const { courtClusterListAllOptions } = courtClusterStore;
  const { selectedStaffEdit, loading } = staffStore;
  const toast = useToast();
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
  const positionOptions = StaffPositionArray.map((position) => ({
    value: position.id,
    label: position.name,
  }));

  const rolesAdd = selectedStaffEdit?.roleAdd?.map((role) => ({
    value: role.id,
    label: role.name,
  }));

  const handlePositionChange = useCallback((selectRoleId: number) => {
    const selectedRole = StaffPositionArray.find(item => item.id == selectRoleId);
    setRoleOptions(staffRoles
      .filter(item => !selectedRole?.defaultRoles.includes(item)));
  }, [StaffPositionArray, staffRoles]);


  const rolesAddOptions = roleOptions
    .map((role, index) => ({
      value: index,
      label: role,
    }));

  useEffect(() => {
    courtClusterStore.loadCourtClusterListAll();
    loadRoles();
  }, [courtClusterStore, loadRoles]);

  useEffect(() => {
    if (isOpen) {
      handlePositionChange(Number(selectedStaffEdit?.position));
      const selectedRole = StaffPositionArray.find(item => item.id === Number(selectedStaffEdit?.position));
      setRoleOptions(
        staffRoles.filter(item => !selectedRole?.defaultRoles.includes(item))
      );
    }
  }, [isOpen, StaffPositionArray, staffRoles, selectedStaffEdit?.position, handlePositionChange]);

  return (
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
                  roles: rolesAdd ?? []
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
                    positionId: values.position.value,
                    roleAdd: values.roles.map(item => item.label)
                  })
                  try {
                    await staffStore.updateStaff(data, onClose, toast)
                  } catch (error) {
                    console.error("Failed to edit staff:", error);
                  }
                }}
              >
                {({ handleSubmit }) => {
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
                            {({ field, form }: any) => (
                              <Select
                                {...field}
                                options={positionOptions}
                                onChange={(option: any) => {
                                  form.setFieldValue('position', option)
                                  handlePositionChange(option.value);
                                }}
                                isSearchable={true}
                                value={form.values.position}
                              />
                            )}
                          </Field>
                        </FormControl>
                        <FormControl>
                          <FormLabel className="title_label">Làm việc ở cụm sân</FormLabel>
                          <Field name="courtcluster">
                            {({ field, form }: any) => (
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
                      <FormControl>
                        <FormLabel className="title_label">Thêm chức vụ</FormLabel>
                        <Field name="roles">
                          {({ field, form }: any) => {
                            const initRoles = form.values.roles?.filter((role: any) =>
                              rolesAddOptions.some((option) => option.label === role.label)
                            );

                            if (initRoles?.length !== form.values.roles?.length) {
                              form.setFieldValue('roles', initRoles);
                            }

                            return (
                              <Select
                                {...field}
                                menuShouldScrollIntoView={false}
                                menuPlacement="top"
                                closeMenuOnSelect={true}
                                isMulti
                                options={rolesAddOptions.filter(
                                  (item1) => !form.values.roles?.some((item: any) => item1.label === item.label)
                                )}
                                placeholder="Chọn"
                                value={form.values.roles}
                                onChange={(options: any) => {
                                  // Cập nhật giá trị mới cho form
                                  const validOptions = options.filter((option: any) =>
                                    rolesAddOptions.some((item) => item.label === option.label)
                                  );
                                  form.setFieldValue('roles', validOptions);
                                }}
                              />
                            );
                          }}
                        </Field>
                      </FormControl>

                      <Stack direction="row" justifyContent="flex-end" mt={9}>
                        <Button className="save" disabled={loading} isLoading={loading} type="submit">
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
  );
});

export default UpdateStaffPage;
