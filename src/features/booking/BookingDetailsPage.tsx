import { Card, CardBody, CardHeader, Heading } from '@chakra-ui/react';
import PageHeadingAtoms from '../atoms/PageHeadingAtoms';
import BookingInfoComponent from './components/BookingInfoComponent';
interface IProps {
  returnPath: string;
  titleReturn: string;
}
const BookingDetailsPage = ({ returnPath = '/booking', titleReturn = 'Danh sách booking' }: IProps) => {
  return (
    <>
      <PageHeadingAtoms breadCrumb={[{ title: titleReturn, to: returnPath }, {title:'Chi tiết booking 1', to:'/booking/chi-tiet/1'}]} />

      <Card className='mt-5'>
        <CardHeader>
          <Heading size={'xl'}>Chi tiết booking 1</Heading>
        </CardHeader>
        <CardBody>
          <BookingInfoComponent />
        </CardBody>
      </Card>
    </>
  );
};

export default BookingDetailsPage;
