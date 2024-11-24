import ButtonPrimaryAtoms from '@/features/atoms/ButtonPrimaryAtoms';
import PlusIcon from '@/features/atoms/PlusIcon';
import {
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  Grid,
  GridItem,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { FastField, Form, Formik, FormikProps } from 'formik';
import CourtPriceFieldComponent from '../components/CourtPriceFieldComponent';
import * as Yup from 'yup';

export interface CourtCreateFormik {
  courtDetails: CourtCreateModel;
}

export interface CourtCreateModel {
  courtName: string;
  courtClusterId: number;
  courtPrice: CourtPriceModel[];
}

export interface CourtPriceModel {
  fromTime: string;
  toTime: string;
  price: number;
}
interface CourtCreatePopUpProps {
  openTime: string;
  closeTime: string;
  courtClusterId: number;
}
import dayjs from 'dayjs';
import { useStore } from '@/app/stores/store';

const CourtCreatePopup = ({ openTime, closeTime, courtClusterId }: CourtCreatePopUpProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const validationSchema = Yup.object().shape({
    courtDetails: Yup.object().shape({
      courtName: Yup.string().required('Tên sân là bắt buộc'),
      courtPrice: Yup.array()
        .of(
          Yup.object().shape({
            fromTime: Yup.string().required('Thời gian bắt đầu là bắt buộc'),
            toTime: Yup.string().required('Thời gian kết thúc là bắt buộc'),
            price: Yup.number().required('Giá là bắt buộc').min(10000, 'Giá phải lớn hơn 10000'),
          }),
        )
        .min(1, 'Cần có ít nhất một giá trị trong danh sách giá')
        .required('Danh sách giá là bắt buộc')
        .test('validate-times', 'Thời gian không hợp lệ', function (courtPrice) {
          if (!courtPrice || courtPrice.length === 0) return true;
          const firstFromTime = dayjs(courtPrice[0]?.fromTime, 'HH:mm');
          const lastToTime = dayjs(courtPrice[courtPrice.length - 1]?.toTime, 'HH:mm');
          return (
            firstFromTime.isSame(dayjs(openTime, 'HH:mm')) &&
            lastToTime.isSame(dayjs(closeTime, 'HH:mm'))
          );
        }),
    }),
  });
  const toast = useToast();
  const { courtManagerStore } = useStore();
  const handleSumbit = async (value: object) => {
    await courtManagerStore.createCourt(value, toast);
  };

  return (
    <>
      <ButtonPrimaryAtoms className="bg-primary-900" handleOnClick={onOpen}>
        <Center gap={1}>
          <PlusIcon color="white" height="1.5rem" width="1.5rem" />
          Thêm mới
        </Center>
      </ButtonPrimaryAtoms>

      <Modal isOpen={isOpen} onClose={onClose} size={'6xl'}>
        <ModalOverlay />

        <Formik
          initialValues={{
            courtDetails: {
              courtClusterId: courtClusterId,
              courtName: '',
              courtPrice: [
                {
                  fromTime: '',
                  toTime: '',
                  price: 0,
                },
              ],
            },
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            await handleSumbit(values.courtDetails);
            onClose();
          }}
          context={{ openTime: openTime, closeTime: closeTime }}
        >
          {(props: FormikProps<CourtCreateFormik>) => (
            <Form>
              <ModalContent>
                <ModalHeader>Thêm mới sân</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Grid
                    templateColumns={'repeat(12,1fr)'}
                    gap={'1px'}
                    className={'rounded-t-md text-white w-full'}
                  >
                    <GridItem className={'bg-primary-700  px-4 py-2 rounded-tl-md'} colSpan={3}>
                      Tên sân
                    </GridItem>
                    <GridItem className={'bg-primary-700  px-4 py-2'} colSpan={4}>
                      Khung giờ
                    </GridItem>
                    <GridItem className={'bg-primary-700  px-4 py-2'} colSpan={3}>
                      Giá tiền
                    </GridItem>
                    <GridItem
                      className={'rounded-tr-md bg-primary-700  px-4 py-2'}
                      colSpan={2}
                    ></GridItem>
                  </Grid>
                  <Grid
                    templateColumns={'repeat(12,1fr)'}
                    gap={5}
                    className={`bg-white py-2  w-full`}
                  >
                    <GridItem colSpan={3}>
                      <FastField name={`courtDetails.courtName`}>
                        {({ field, form }: any) => (
                          <FormControl
                            isInvalid={
                              form.errors.courtDetails?.courtName &&
                              form.touched.courtDetails?.courtName
                            }
                          >
                            <Input {...field} placeholder="Tên sân"></Input>
                            <FormErrorMessage>
                              {form.errors.courtDetails?.courtName}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </FastField>
                    </GridItem>
                    <CourtPriceFieldComponent props={props} />
                  </Grid>
                  {props.errors.courtDetails?.courtPrice &&
                    typeof props.errors.courtDetails?.courtPrice === 'string' && (
                      <div className="text-red-500">
                        *Lưu ý: {props.errors.courtDetails.courtPrice}
                      </div>
                    )}
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme="red" mr={3} onClick={onClose}>
                    Đóng
                  </Button>
                  <Button type="submit" colorScheme="teal">
                    Lưu
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default CourtCreatePopup;
