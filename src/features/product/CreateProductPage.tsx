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
import SelectFieldAtoms from '@/app/common/form/SelectFieldAtoms';
import { observer } from 'mobx-react-lite';

interface IProp {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProductPage = ({ isOpen, onClose }: IProp) => {
  const validationSchema = Yup.object().shape({
    productName: Yup.string().required('Tên sản phẩm không được bỏ trống'),
    quantity: Yup.number().required('Số lượng không được bỏ trống').positive('Giá nhập phải là số dương'),
    importFee: Yup.number()
      .typeError('Giá nhập phải là một số')
      .required('Giá nhập không được bỏ trống')
      .positive('Giá nhập phải là số dương'),
    priceSell: Yup.number()
      .typeError('Giá bán phải là một số')
      .required('Giá bán không được bỏ trống')
      .positive('Giá bán phải là số dương'),
    thumbnail: Yup.string().required('Ảnh không được bỏ trống'),
    description: Yup.string().required('Mô tả không được bỏ trống'),
    categoryId: Yup.number().required('Thể loại không được bỏ trống'),
    courtClusterId: Yup.number().required('Khu không được bỏ trống'),
  });
  const { categoryStore, courtClusterStore, productStore, uploadStore } = useStore();
  const { categoryOption } = categoryStore;
  const { courtClusterListAllOptions } = courtClusterStore;
  const toast = useToast();
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
                importFee: 1,
                thumbnail: '',
                description: '',
                categoryId: categoryOption[0]?.value ?? 1,
                courtClusterId: courtClusterListAllOptions[0]?.value ?? 1,
              }}
              onSubmit={async (values) => {
                const product = new ProductInput({
                  categoryId: Number(values.categoryId),
                  description: values.description,
                  price: values.priceSell,
                  importFee: values.importFee,
                  quantity: values.quantity,
                  // thumbnail: values.thumbnail,
                  thumbnailUrl: values.thumbnail,
                  productName: values.productName,
                  courtClusterId: Number(values.courtClusterId)
                });
                await productStore.createProduct(product, toast);
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
                      name="importFee"
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

export default observer(CreateProductPage);
