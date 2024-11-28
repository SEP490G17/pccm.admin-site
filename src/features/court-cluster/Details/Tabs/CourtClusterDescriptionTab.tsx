import { observer } from 'mobx-react-lite';
import { useStore } from '@/app/stores/store.ts';
import { Card, CardBody, CardHeader, Center, Heading, Skeleton } from '@chakra-ui/react';

const CourtClusterDescriptionTab = observer(() => {
  const { courtClusterStore } = useStore();
  const { selectedCourtCluster: selectedCourt } = courtClusterStore;
  return (
      <Skeleton width={'100%'} minHeight={'300rem'} isLoaded={!courtClusterStore.loadingInitialDetailsPage}>
        {selectedCourt && (
          <Card size={'lg'}>
            <CardHeader>
              <Center>
                <Heading size="xl">Thông tin về {selectedCourt.title}</Heading>
              </Center>
            </CardHeader>

            <CardBody>
              <Center>
                <div
                  className="w-[50rem]"
                  dangerouslySetInnerHTML={{ __html: selectedCourt.description }}
                />
              </Center>
            </CardBody>
          </Card>
        )}
      </Skeleton>
  );
});

export default CourtClusterDescriptionTab;
