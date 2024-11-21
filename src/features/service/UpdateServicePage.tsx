import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Stack,
  useToast,
  VStack,
} from '@chakra-ui/react';
import './style.scss';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import TextFieldAtoms from '@/app/common/form/TextFieldAtoms';
import MultiSelectDataAtom from '@/app/common/form/MultiSelectDataAtom';
import { useStore } from '@/app/stores/store';
import { useEffect } from 'react';
import NumberFieldAtom from '@/app/common/form/NumberFieldAtoms';
import { ServiceEditDTO } from '@/app/models/service.model';
import { observer } from 'mobx-react';

interface IProp {
  isOpen: boolean;
  onClose: () => void;
}

const UpdateServicePage = observer(({ isOpen, onClose }: IProp) => {
  const { courtClusterStore, serviceStore } = useStore();
  const { courtClusterListAllOptions } = courtClusterStore;
  const { selectedService } = serviceStore;
  useEffect(() => {
    Promise.all([courtClusterStore.loadCourtClusterListAll()]);
  }, [courtClusterStore]);

  const validationSchema = Yup.object().shape({
    service_name: Yup.string().required('Tiêu đề dịch vụ không được bỏ trống'),
    description: Yup.string().required('Mô tả không được bỏ trống'),
    price: Yup.number().required('Giá cả không được bỏ trống'),
    courtclusters: Yup.array().required('Thuộc cụm sân không được bỏ trống'),
  });

  const toast = useToast();

  const handleSubmit = async (value: ServiceEditDTO) => {
    await serviceStore.updateService(value, toast);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent width="1164px" flexShrink="0" borderRadius="20px" bg="#FFF">
        <ModalHeader bg="#00423D" color="white" borderRadius="20px 20px 0 0">
          Cập nhật Dịch Vụ
        </ModalHeader>
        <ModalCloseButton color="#FFF" />
        <ModalBody>
          <VStack spacing="20px" align="stretch">
            <Skeleton isLoaded={!serviceStore.loadingEdit}>
              <Formik
                initialValues={{
                  service_name: selectedService?.serviceName,
                  description: selectedService?.description,
                  price: selectedService?.price,
                  courtclusters: selectedService?.courtClusterId
                    ? [selectedService.courtClusterId]
                    : [],
                }}
                onSubmit={async (values) => {
                  const service = new ServiceEditDTO({
                    id: selectedService?.id,
                    courtClusterId: values.courtclusters,
                    serviceName: values.service_name,
                    description: values.description,
                    price: Number(values.price),
                  });
                  await handleSubmit(service);
                  onClose();
                }}
                validationSchema={validationSchema}
              >
                {({ handleSubmit, isSubmitting }) => {
                  return (
                    <Form onSubmit={handleSubmit}>
                      <TextFieldAtoms
                        label="Tên dịch vụ"
                        isRequired={true}
                        placeholder="Nhập tên"
                        name="service_name"
                      />

                      <TextFieldAtoms
                        label="Mô tả dịch vụ"
                        isRequired={true}
                        placeholder="Nhập mô tả"
                        name="description"
                      />

                      <NumberFieldAtom
                        label="Giá cả"
                        isRequired={true}
                        placeholder="xxxxxxx"
                        name="price"
                      />

                      <MultiSelectDataAtom
                        isDisabled={true}
                        label="Thuộc cụm sân"
                        isRequired={true}
                        options={courtClusterListAllOptions}
                        name="courtclusters"
                      />

                      <Stack direction="row" justifyContent="flex-end" mt={9}>
                        <Button
                          // disabled={isSubmitting || !isValid}
                          className="save"
                          isLoading={isSubmitting}
                          type="submit"
                        >
                          Cập nhật
                        </Button>
                      </Stack>
                    </Form>
                  );
                }}
              </Formik>
            </Skeleton>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});

export default UpdateServicePage;
