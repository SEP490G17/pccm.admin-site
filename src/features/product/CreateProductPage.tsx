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
import SelectFieldAtoms from '@/app/common/form/SelectFieldAtoms';

interface IProp {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProductPage = ({ isOpen, onClose }: IProp) => {
  const validationSchema = Yup.object().shape({
    productName: Yup.string().required('Tên sản phẩm không được bỏ trống'),
    quantity: Yup.number().required('Số lượng không được bỏ trống').positive('Giá nhập phải là số dương'),
    priceBuy: Yup.number()
      .typeError('Giá nhập phải là một số')
      .required('Giá nhập không được bỏ trống')
      .positive('Giá nhập phải là số dương'),
    priceSell: Yup.number()
      .typeError('Giá bán phải là một số')
      .required('Giá bán không được bỏ trống')
      .positive('Giá bán phải là số dương'),
    thumbnail: Yup.string().required('Ảnh không được bỏ trống'),
    description: Yup.string().required('Mô tả không được bỏ trống'),
    category: Yup.number().required('Thể loại không được bỏ trống'),
    courtCluster: Yup.number().required('Khu không được bỏ trống'),
  });
  const { categoryStore, courtClusterStore, productStore, uploadStore } = useStore();
  const { categoryOption } = categoryStore;
  const { courtClusterListAllOptions } = courtClusterStore;
  return (
    <Modal isOpen={isOpen} onClose={() => { uploadStore.loading = false; onClose() }} size="6xl">
      <ModalOverlay />
      <ModalContent width="1164px" flexShrink="0" borderRadius="20px" bg="#FFF">
        <ModalHeader bg="#00423D" color="white" borderRadius="20px 20px 0 0">
          Thêm Hàng Hóa
        </ModalHeader>
        <ModalCloseButton color="#FFF" />
        <ModalBody>
          <VStack spacing="20px" align="stretch">
            <Formik
              initialValues={{
                productName: '',
                quantity: 1,
                priceSell: 1,
                priceBuy: 1,
                thumbnail: '',
                description: '',
                category: categoryOption[0]?.value ?? 1,
                courtCluster: courtClusterListAllOptions[0]?.value ?? 1,
              }}
              onSubmit={async (values) => {
                const product = new ProductInput({
                  categoryId: Number(values.category),
                  description: values.description,
                  priceSell: values.priceSell,
                  priceBuy: values.priceBuy,
                  quantity: values.quantity,
                  // thumbnail: values.thumbnail,
                  thumbnailUrl: values.thumbnail,
                  productName: values.productName,
                  courtClusterId: Number(values.courtCluster)
                });
                await productStore.createProduct(product);
                onClose()
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
                  <Flex className='items-start gap-4'>
                    <SelectFieldAtoms
                      size="lg"
                      name="categoryId"
                      backgroundColor="#FFF"
                      border="1px solid "
                      borderRadius="md"
                      borderColor="gray.300"
                      label="Thể loại"
                      options={categoryOption}
                      isRequired={true}
                    />
                    <SelectFieldAtoms
                      size="lg"
                      name="courtClusterId"
                      backgroundColor="#FFF"
                      border="1px solid "
                      borderRadius="md"
                      borderColor="gray.300"
                      label="Cum san"
                      options={courtClusterListAllOptions}
                      isRequired={true}
                    />
                  </Flex>

                  <Flex className="items-start gap-4">
                    <NumberFieldAtom
                      isRequired={true}
                      label="Số lượng"
                      className="input_text"
                      name="quantity"
                      placeholder="xxxxxxx"
                    />
                    <NumberFieldAtom
                      isRequired={true}
                      label="Giá bán"
                      className="input_text"
                      name="priceSell"
                      placeholder="xxxxxxx"
                    />
                    <NumberFieldAtom
                      isRequired={true}
                      label="Giá nhập"
                      className="input_text"
                      name="priceBuy"
                      placeholder="xxxxxxx"
                    />
                  </Flex>
                  <FileUploadFieldAtoms
                    label="Ảnh sản phẩm"
                    limit={1}
                    name="thumbnail"
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
                    <Button
                      // disabled={isSubmitting || !isValid || uploadStore.loading}
                      className="save"
                      isLoading={isSubmitting}
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

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateProductPage;
