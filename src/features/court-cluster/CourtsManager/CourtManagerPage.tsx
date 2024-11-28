import { useStore } from '@/app/stores/store';
import { Flex, Heading, useToast } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CourtListTableComponent from './components/CourtListTableComponent';
import PageHeadingAtoms from '@/features/atoms/PageHeadingAtoms';
import CourtCreatePopup from './popup/CourtCreatePopup';

const CourtsManagerPage = observer(() => {
  // inject store
  const { courtManagerStore } = useStore();
  const { courtArray, loadingInitial, loadCourts, courtClusterName, openTime, closeTime } =
    courtManagerStore;

  // get params
  const toast = useToast();
  const { id } = useParams();

  //first-time render
  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      loadCourts(Number(id), toast);
    }
  }, [id, loadCourts, toast]);

  return (
    <>
      {id && (
        <PageHeadingAtoms
          breadCrumb={[
            { title: 'Cụm sân', to: '/cum-san' },
            {
              title: `Chi tiết cụm ${courtClusterName}`,
              to: `/cum-san/${id}/chi-tiet`,
            },
            {
              title: 'Quản lý sân',
              to: `/cum-san/${id}/quan-ly-san`,
            },
          ]}
        />
      )}
      <Heading className="mt-4 mb-8" size={'lg'}>
        Quản lý sân thuộc cụm {id}
      </Heading>
      <CourtListTableComponent
        courtList={courtArray}
        loadingInitial={loadingInitial}
        openTime={openTime}
        closeTime={closeTime}
        pageSize={4}
      />
      <Flex className='float-end justify-end'>
        <CourtCreatePopup courtClusterId={Number(id)} openTime={openTime} closeTime={closeTime}/>
      </Flex>
    </>
  );
});

export default CourtsManagerPage;
