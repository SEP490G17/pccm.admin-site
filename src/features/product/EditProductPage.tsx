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
import FileUploadFieldAtoms from '@/app/common/form/FileUploadFieldAtoms';
import { useStore } from '@/app/stores/store';
import { ProductInput } from '@/app/models/product.model';
import { observer } from 'mobx-react-lite';

interface IProp {
  isOpen: boolean;
  onClose: () => void;
}

const EditProductPage = observer(({ isOpen, onClose }: IProp) => {
  const validationSchema = Yup.object().shape({
    productName: Yup.string().required('Tên sản phẩm không được bỏ trống'),
    quantity: Yup.number().required('Số lượng không được bỏ trống'),
    price: Yup.number()
      .typeError('Giá nhập phải là một số')
      .required('Giá nhập không được bỏ trống')
      .min(0, 'Giá nhập phải lớn hơn 0'),
    importFee: Yup.number()
      .typeError('Giá bán phải là một số')
      .required('Giá bán không được bỏ trống')
      .min(0, 'Giá nhập phải lớn hơn 0'),
    thumbnailUrl: Yup.string().required('Ảnh không được bỏ trống'),
    description: Yup.string().required('Mô tả không được bỏ trống'),
    categoryId: Yup.number().required('Thể loại không được bỏ trống'),
    courtClusterId: Yup.number().required('Khu không được bỏ trống'),
  });
  const toast = useToast();
  const { productStore, uploadStore } = useStore();
  const { selectedProduct } = productStore;
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
          {selectedProduct ? 'Chỉnh sửa hàng hoá' : 'Thêm mới hàng hoá'}
        </ModalHeader>
        <ModalCloseButton color="#FFF" />
        <ModalBody>
          <VStack spacing="20px" align="stretch">
            <Skeleton isLoaded={!productStore.loadingEdit}>
              <Formik
                initialValues={{
                  categoryId: selectedProduct.categoryId,
                  description: selectedProduct.description,
                  importFee: selectedProduct.importFee,
                  price: selectedProduct.price,
                  quantity: selectedProduct.quantity,
                  thumbnailUrl: selectedProduct.thumbnailUrl,
                  productName: selectedProduct.productName,
                  courtClusterId: selectedProduct.courtClusterId,
                  courtClusterName: selectedProduct.courtClusterName,
                }}
                onSubmit={async (values) => {
                  const product = new ProductInput({
                    categoryId: Number(values.categoryId),
                    description: values.description,
                    price: values.price,
                    importFee: values.importFee,
                    quantity: values.quantity,
                    productName: values.productName,
                    courtClusterId: Number(values.courtClusterId),
                    thumbnailUrl: values.thumbnailUrl,
                  });
                  await productStore.editProduct(product,toast).finally(onClose);
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
                        isDisabled={true}
                        label="Số lượng"
                        className="input_text"
                        name="quantity"
                        placeholder="xxxxxxx"
                      />
                      <NumberFieldAtom
                        isRequired={true}
                        label="Giá bán"
                        className="input_text"
                        name="price"
                        placeholder="xxxxxxx"
                      />
                      <NumberFieldAtom
                        isDisabled={true}
                        label="Giá nhập"
                        className="input_text"
                        name="importFee"
                        placeholder="xxxxxxx"
                      />
                    </Flex>
                    <FileUploadFieldAtoms
                      label="Ảnh sản phẩm"
                      limit={1}
                      name="thumbnailUrl"
                      isRequired={true}
                    />

                    <TextFieldAtoms
                      isRequired={true}
                      label="Mô tả hàng hóa"
                      className="input_text"
                      type="text"
                      name="description"
                      placeholder="Mô tả"
                    />
                    <Stack direction="row" justifyContent="flex-end" mt={9}>
                      <Button className="save" isLoading={isSubmitting} type="submit">
                        Lưu
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

export default EditProductPage;
