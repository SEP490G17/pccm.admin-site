import { observer } from 'mobx-react';
import { useStore } from '@/app/stores/store.ts';
import { Center } from '@chakra-ui/react';

const CourtClusterDescriptionTab = observer(() => {
  const { courtClusterStore } = useStore();
  const { selectedCourt } = courtClusterStore;
  return (
    <>
      {selectedCourt && (
        <Center>
          <div
            className="w-[50.5rem]"
            dangerouslySetInnerHTML={{ __html: selectedCourt.description }}
          />
        </Center>
      )}
    </>
  );
});

export default CourtClusterDescriptionTab;
