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
  Skeleton,
  Stack,
  useToast,
  VStack,
} from '@chakra-ui/react';
import './style.scss';
import { Form, Formik } from 'formik';
import TextFieldAtoms from '@/app/common/form/TextFieldAtoms';
import * as Yup from 'yup';
import NumberFieldAtom from '@/app/common/form/NumberFieldAtoms';
import { useStore } from '@/app/stores/store';
import { ProductImport } from '@/app/models/product.model';
import { observer } from 'mobx-react-lite';

interface IProp {
  isOpen: boolean;
  onClose: () => void;
}

const ImportProductPage = observer(({ isOpen, onClose }: IProp) => {
  const validationSchema = Yup.object().shape({
    productName: Yup.string().required('Tên sản phẩm không được bỏ trống'),
    quantity: Yup.number().required('Số lượng hàng nhập không được bỏ trống'),
    importFee: Yup.number()
      .typeError('Giá nhập phải là một số')
      .required('Giá nhập không được bỏ trống')
      .min(0, 'Giá nhập phải lớn hơn 0'),
    courtClusterId: Yup.number().required('Cụm sân không được bỏ trống'),
  });
  const toast = useToast();
  const { productStore, uploadStore } = useStore();
  const { selectedProduct, selectedIdProduct } = productStore;
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        uploadStore.loading = false;
        onClose();
      }}
      size="6xl"
    >
      <ModalOverlay />
      <ModalContent width="1164px" flexShrink="0" borderRadius="20px" bg="#FFF">
        <ModalHeader bg="#00423D" color="white" borderRadius="20px 20px 0 0">
          Nhập hàng hóa
        </ModalHeader>
        <ModalCloseButton color="#FFF" />
        <ModalBody>
          <VStack spacing="20px" align="stretch">
            <Skeleton isLoaded={!productStore.loadingEdit}>
              <Formik
                initialValues={{
                  importFee: 1,
                  quantity: 1,
                  productName: selectedProduct.productName,
                  courtClusterId: selectedProduct.courtClusterId,
                  courtClusterName: selectedProduct.courtClusterName,
                }}
                onSubmit={async (values) => {
                  const product = new ProductImport({
                    productId: selectedIdProduct,
                    importFee: values.importFee,
                    quantity: values.quantity,
                  });
                  await productStore.importProduct(product, toast).finally(onClose);
                }}
                validationSchema={validationSchema}
              >
                {({ handleSubmit, isSubmitting }) => (
                  <Form onSubmit={handleSubmit}>
                    <TextFieldAtoms
                      isRequired={true}
                      label="Tên hàng hóa"
                      className="input_text"
                      type="text"
                      name="productName"
                      placeholder="Nhập"
                      isReadOnly={true}
                    />
                    <Flex className="items-start gap-4">
                      <TextFieldAtoms
                        isRequired={true}
                        label="Cụm sân"
                        className="input_text"
                        type="text"
                        name="courtClusterName"
                        placeholder="Nhập"
                        isReadOnly={true}
                      />
                    </Flex>

                    <Flex className="items-start gap-4">
                      <NumberFieldAtom
                        label="Số lượng hàng nhập"
                        className="input_text"
                        name="quantity"
                        placeholder="xxxxxxx"
                      />
                      <NumberFieldAtom
                        label="Giá nhập"
                        className="input_text"
                        name="importFee"
                        placeholder="xxxxxxx"
                      />
                    </Flex>
                    <Stack direction="row" justifyContent="flex-end" mt={9}>
                      <Button className="save" isLoading={isSubmitting} type="submit">
                        Nhập
                      </Button>
                    </Stack>
                  </Form>
                )}
              </Formik>
            </Skeleton>
          </VStack>
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
});

export default ImportProductPage;
