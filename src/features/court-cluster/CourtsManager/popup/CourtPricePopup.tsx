import { CourtPriceResponse } from '@/app/models/court.model';
import {
  Button,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { FC } from 'react';
import { MdPriceChange } from 'react-icons/md';
import { Form, Formik, FormikProps } from 'formik';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import CourtPriceListTable from '../components/CourtPriceListTableComponent';
import { observer } from 'mobx-react';
import { useStore } from '@/app/stores/store';
interface CourtPricePopupProps {
  courtPrices: CourtPriceResponse[];
  courtId: number;
  openTime: string;
  closeTime: string;
}
interface CourtPriceFormik {
  courtPrices: CourtPriceResponse[];
}

const CourtPricePopup: FC<CourtPricePopupProps> = observer(
  ({ courtPrices, courtId, openTime, closeTime }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const CourtPriceSchema = Yup.object().shape({
      courtPrices: Yup.array()
        .of(
          Yup.object().shape({
            fromTime: Yup.string().required('Thời gian bắt đầu không được để trống'),
            toTime: Yup.string()
              .required('Thời gian kết thúc không được để trống')
              .test(
                'is-greater',
                'Thời gian kết thúc phải lớn hơn thời gian bắt đầu',
                function (toTime) {
                  const { fromTime } = this.parent;
                  return dayjs(toTime, 'HH:mm').isAfter(dayjs(fromTime, 'HH:mm'));
                },
              ),
            price: Yup.number()
              .typeError('Giá phải là một số')
              .required('Giá không được để trống')
              .positive('Giá phải lớn hơn 0'),
          }),
        )
        .test('no-overlap', 'Khoảng thời gian phải nối tiếp nhau', function (courtPrices) {
          if (!courtPrices || courtPrices.length < 2) return true;

          for (let i = 0; i < courtPrices.length - 1; i++) {
            const currentEnd = dayjs(courtPrices[i].toTime, 'HH:mm');
            const nextStart = dayjs(courtPrices[i + 1].fromTime, 'HH:mm');

            if (!currentEnd.isSame(nextStart)) {
              return false; // Phát hiện trùng
            }
          }
          return true;
        })
        .test(
          'match-open-close',
          'Thời gian bắt đầu phải trùng với giờ mở cửa và thời gian kết thúc phải trùng với giờ đóng cửa',
          function (courtPrices) {
            const opentime = openTime; // Nhận opentime từ context
            const closetime = closeTime; // Nhận closetime từ context
            if (!courtPrices || courtPrices.length === 0) return true;
            const firstFromTime = dayjs(courtPrices[0]?.fromTime, 'HH:mm');
            const lastToTime = dayjs(courtPrices[courtPrices.length - 1]?.toTime, 'HH:mm');
            return (
              firstFromTime.isSame(dayjs(opentime, 'HH:mm')) &&
              lastToTime.isSame(dayjs(closetime, 'HH:mm'))
            );
          },
        )
        .min(1, 'Cần ít nhất một khung giờ'),
    });

    const { courtManagerStore } = useStore();
    const { updateCourtPrices } = courtManagerStore;
    const toast = useToast();
    return (
      <>
        <Tooltip label="Quản lý giá lẻ" hasArrow placeSelf={'auto'}>
          <IconButton
            colorScheme="teal"
            icon={<MdPriceChange className="text-xl" />}
            aria-label="Quản lý giá lẻ"
            size={'sm'}
            onClick={onOpen}
          />
        </Tooltip>

        <Modal isOpen={isOpen} onClose={onClose} size={'6xl'}>
          <ModalOverlay />
          <Formik
            initialValues={{courtPrices }}
            onSubmit={async (values) => {
              await updateCourtPrices(courtId, values.courtPrices, toast);
              onClose();
            }}
            validationSchema={CourtPriceSchema}
          >
            {(props: FormikProps<CourtPriceFormik>) => (
              <Form>
                <ModalContent>
                  <ModalHeader>
                      <Heading size={'lg'}>Bảng giá theo giờ của sân</Heading>
                      <Heading size={'sm'} className='mt-4 mb-0 pb-0'>
                        Giờ mở cửa {openTime.split(":")[0]}h:{openTime.split(":")[1]}p
                        - {closeTime.split(":")[0]}h:{closeTime.split(":")[1]}p
                      </Heading>
                  </ModalHeader>
                  <ModalCloseButton />

                  <ModalBody style={{ zIndex: 10 }}>
                    <CourtPriceListTable formikProps={props} />

                    {props.errors.courtPrices && typeof props.errors.courtPrices === 'string' && (
                      <div className="text-red-500">*Lưu ý: {props.errors.courtPrices}</div>
                    )}
                  </ModalBody>

                  <ModalFooter>
                    <Button colorScheme="red" className="w-24" mr={3} onClick={onClose}>
                      Thoát
                    </Button>
                    <Button
                      colorScheme="teal"
                      className="w-24"
                      type="submit"
                      isDisabled={!props.dirty || props.isSubmitting}
                    >
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
  },
);

export default CourtPricePopup;
