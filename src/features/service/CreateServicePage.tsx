import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    VStack,
} from "@chakra-ui/react";
import "./style.scss";
import * as Yup from 'yup';
import { Form, Formik } from "formik";
import TextFieldAtoms from "@/app/common/form/TextFieldAtoms";
import MultiSelectDataAtom from "@/app/common/form/MultiSelectDataAtom";
import { useStore } from "@/app/stores/store";
import { useEffect } from "react";
import NumberFieldAtom from "@/app/common/form/NumberFieldAtoms";
import { ServiceDTO } from "@/app/models/service.model";

interface IProp {
    isOpen: boolean;
    onClose: () => void;
}

const CreateServicePage = ({ isOpen, onClose }: IProp) => {
    const { courtClusterStore, serviceStore } = useStore()
    const { courtClusterListAllOptions } = courtClusterStore

    useEffect(() => {
        Promise.all([courtClusterStore.loadCourtClusterListAll()])
    }, []);

    const validationSchema = Yup.object().shape({
        service_name: Yup.string().required('Tiêu đề dịch vụ không được bỏ trống'),
        description: Yup.string().required('Mô tả không được bỏ trống'),
        price: Yup.number().required('Giá cả không được bỏ trống'),
        courtclusters: Yup.array().required('Thuộc cụm sân không được bỏ trống'),
    });

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="6xl">
                <ModalOverlay />
                <ModalContent width="1164px" flexShrink="0" borderRadius="20px" bg="#FFF">
                    <ModalHeader bg="#00423D" color="white" borderRadius="20px 20px 0 0">
                        Thêm Dịch Vụ
                    </ModalHeader>
                    <ModalCloseButton color='#FFF' />
                    <ModalBody>
                        <VStack spacing="20px" align="stretch">
                            <Formik
                                initialValues={{
                                    service_name: '',
                                    description: '',
                                    price: 1,
                                    courtclusters: [],
                                }}
                                onSubmit={async (values) => {
                                    const service = new ServiceDTO({
                                        courtClusterId: values.courtclusters,
                                        serviceName: values.service_name,
                                        description: values.description,
                                        price: values.price
                                    })
                                    await serviceStore.createService(service)
                                    onClose()
                                }}
                                validationSchema={validationSchema}
                            >
                                {({ handleSubmit, isSubmitting }) => {
                                    return (
                                        <Form onSubmit={handleSubmit}>
                                            <TextFieldAtoms
                                                label='Tên dịch vụ'
                                                isRequired={true}
                                                placeholder='Nhập tên'
                                                name='service_name' />

                                            <TextFieldAtoms
                                                label='Mô tả dịch vụ'
                                                isRequired={true}
                                                placeholder='Nhập mô tả'
                                                name='description' />

                                            <NumberFieldAtom
                                                label='Giá cả'
                                                isRequired={true}
                                                placeholder='xxxxxxx'
                                                name='price' />

                                            <MultiSelectDataAtom
                                                label='Thuộc cụm sân'
                                                isRequired={true}
                                                options={courtClusterListAllOptions}
                                                name="courtclusters" />

                                            <Stack direction='row' justifyContent='flex-end' mt={9}>
                                                <Button
                                                    // disabled={isSubmitting || !isValid}
                                                    className="save"
                                                    isLoading={isSubmitting}
                                                    type="submit"
                                                >
                                                    Tạo
                                                </Button>
                                            </Stack>
                                        </Form>
                                    );
                                }}
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

export default CreateServicePage;
