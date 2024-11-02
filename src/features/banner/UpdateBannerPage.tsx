import FileUploadFieldAtoms from '@/app/common/form/FileUploadFieldAtoms';
import SelectFieldAtoms from '@/app/common/form/SelectFieldAtoms';
import TextFieldAtoms from '@/app/common/form/TextFieldAtoms';
import TimeInputAtom from '@/app/common/form/TimeInputAtom';
import { BannerDTO } from '@/app/models/banner.model';
import { useStore } from '@/app/stores/store';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Flex,
    VStack,
    HStack,
    Stack,
    Skeleton,

} from '@chakra-ui/react';
import { Formik } from 'formik';
import { observer } from 'mobx-react';
import { Form } from 'react-router-dom';
import * as Yup from 'yup';

interface IProp {
    isOpen: boolean;
    onClose: () => void;
}


const UpdateBannerPage = ({ isOpen, onClose }: IProp) => {
    const { bannerStore } = useStore();
    const { selectedBanner } = bannerStore;
    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Tiêu đề banner không được bỏ trống'),
        imageUrl: Yup.string().required('Ảnh banner không được bỏ trống'),
        description: Yup.string().required('Mô tả không được bỏ trống'),
        linkUrl: Yup.string().required('Đường link dẫn không được bỏ trống'),
        startDate: Yup.string().required('Giờ bắt đầu không được bỏ trống'),
        endDate: Yup.string()
            .required('Giờ kết thúc không được bỏ trống')
            .when("startDate", (startDate, schema) => {
                return schema.test({
                    name: "is-after-start-time",
                    message: "Giờ kết thúc phải sau giờ bắt đầu",
                    test: function (value) {
                        console.log(startDate)
                        if (typeof startDate[0] === 'string' && typeof value === 'string') {
                            return new Date(value) > new Date(startDate[0]);
                        }
                        return false;
                    },
                });
            }),
        status: Yup.number().required('Trạng thái banner không được bỏ trống'),
        type: Yup.number().required('Thể loại banner không được bỏ trống'),
        destination: Yup.number().required('Trang đích banner không được bỏ trống'),
    });

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="6xl">
                <ModalOverlay />
                <ModalContent width="1164px" flexShrink="0" borderRadius="20px" bg="#FFF">
                    <ModalHeader bg="#00423D" color="white" borderRadius="20px 20px 0 0">
                        Cập nhật banner
                    </ModalHeader>
                    <ModalCloseButton color="#FFF" />
                    <ModalBody>
                        <VStack spacing="20px" align="stretch">
                            <Skeleton isLoaded={!bannerStore.loadingEdit}>
                                <Formik
                                    initialValues={{
                                        title: selectedBanner?.title,
                                        description: selectedBanner?.description,
                                        imageUrl: selectedBanner?.imageUrl,
                                        linkUrl: selectedBanner?.linkUrl,
                                        startDate: selectedBanner?.startDate,
                                        endDate: selectedBanner?.endDate,
                                        status: selectedBanner?.status,
                                        type: selectedBanner?.bannerType,
                                        destination: selectedBanner?.bannerInPage,
                                    }}
                                    onSubmit={async (values) => {
                                        console.log(values)
                                        const banner = new BannerDTO({
                                            id: selectedBanner?.id,
                                            title: values.title,
                                            imageUrl: values.imageUrl,
                                            bannerInPage: Number(values.destination),
                                            bannerType: Number(values.type),
                                            description: values.description,
                                            endDate: values.endDate,
                                            startDate: values.startDate,
                                            linkUrl: values.linkUrl,
                                            status: Number(values.status)
                                        })
                                        await bannerStore.updateBanner(banner)
                                        onClose()
                                    }

                                    }
                                    validationSchema={validationSchema}
                                >
                                    {({ handleSubmit, isSubmitting, isValid, errors }) => {
                                        console.log('Is Valid:', isValid);
                                        console.log('Errors:', errors);

                                        return (
                                            <Form onSubmit={handleSubmit}>
                                                <TextFieldAtoms label='Tiêu đề banner' isRequired={true} placeholder='Nhập tiêu đề' name='title' />
                                                <TextFieldAtoms
                                                    label='Mô tả'
                                                    isRequired={true}
                                                    placeholder='Nhập mô tả'
                                                    name='description' />

                                                <FileUploadFieldAtoms
                                                    label="Ảnh banner"
                                                    limit={1}
                                                    name="imageUrl"
                                                    isRequired={true}
                                                />

                                                <TextFieldAtoms
                                                    label='Đường link dẫn'
                                                    isRequired={true}
                                                    placeholder='Nhập đường link'
                                                    name='linkUrl' />


                                                <FormControl>
                                                    <FormLabel className="title_label">Thời gian</FormLabel>
                                                    <HStack spacing="20px">
                                                        <TimeInputAtom color='green' label='Giờ bắt đầu' type='datetime-local' name='startDate'></TimeInputAtom>
                                                        <TimeInputAtom color='red' label='Giờ kết thúc' type='datetime-local' name='endDate'></TimeInputAtom>
                                                    </HStack>
                                                </FormControl>

                                                <Flex justifyContent="space-between" gap="100px">
                                                    <SelectFieldAtoms
                                                        label='Trang đích'
                                                        name='destination'
                                                        isRequired={false}
                                                        options={[{ value: 0, label: "Trang chủ" }, { value: 1, label: "Trang sản phẩm" }]}
                                                    ></SelectFieldAtoms>

                                                    <SelectFieldAtoms
                                                        label='Thể loại'
                                                        name='type'
                                                        isRequired={false}
                                                        options={[{ value: 0, label: "Banner" }, { value: 1, label: "Event" }]}
                                                    ></SelectFieldAtoms>

                                                    <SelectFieldAtoms
                                                        label='Trạng thái'
                                                        name='status'
                                                        isRequired={false}
                                                        options={[{ value: 1, label: "Hiển thị" }, { value: 0, label: "Ẩn" }]}
                                                    ></SelectFieldAtoms>
                                                </Flex>
                                                <Stack direction='row' justifyContent='flex-end' mt={5}>
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
            </Modal >
        </>
    );
};

export default observer(UpdateBannerPage);
