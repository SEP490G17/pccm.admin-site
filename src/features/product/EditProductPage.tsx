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

const EditProductPage = ({ isOpen, onClose }: IProp) => {
  const validationSchema = Yup.object().shape({
    productName: Yup.string().required('Tên sản phẩm không được bỏ trống'),
    quantity: Yup.number().required('Số lượng không được bỏ trống'),
    price: Yup.number().required('Giả cả không được bỏ trống'),
    thumbnailUrl: Yup.string().required('Ảnh không được bỏ trống'),
    description: Yup.string().required('Mô tả không được bỏ trống'),
    categoryId: Yup.number().required('Thể loại không được bỏ trống'),
    courtClusterId: Yup.number().required('Khu không được bỏ trống'),
  });
  const { categoryStore, courtStore, productStore, uploadStore } = useStore();
  const { categoryOption } = categoryStore;
  const { courtListAllOptions } = courtStore;
  const { loadingEdit, selectedProduct } = productStore;
  console.log(loadingEdit);
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
          Thêm Hàng Hóa
        </ModalHeader>
        <ModalCloseButton color="#FFF" />
        <ModalBody>
          <VStack spacing="20px" align="stretch">
            <Skeleton isLoaded={!productStore.loadingEdit}>
              <Formik
                initialValues={{
                  categoryId: selectedProduct.categoryId ,
                  description: selectedProduct.description ,
                  price: selectedProduct.price ,
                  quantity: selectedProduct.quantity ,
                  thumbnailUrl: selectedProduct.thumbnailUrl ,
                  productName: selectedProduct.productName,
                  courtClusterId: selectedProduct.courtClusterId ,
                }}
                onSubmit={async (values, {setSubmitting}) => {
                  const product = new ProductInput({
                    categoryId: Number(values.categoryId),
                    description: values.description,
                    price: values.price,
                    quantity: values.quantity,
                    productName: values.productName,
                    courtClusterId: Number(values.courtClusterId),
                    thumbnailUrl: values.thumbnailUrl,
                  });
               
                  console.log(product);
                  await productStore.editProduct(product)
                  .finally(()=> setSubmitting(false) );
                }}
                validationSchema={validationSchema}
                enableReinitialize={true}
              >
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
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
                        options={courtListAllOptions}
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
                        label="Giá cả"
                        className="input_text"
                        name="price"
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
                      <Button className="delete" type="button" >
                        Xóa
                      </Button>
                      <Button
                        disabled={isSubmitting || !isValid || uploadStore.loading || !dirty}
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
            </Skeleton>
          </VStack>
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default observer(EditProductPage);
