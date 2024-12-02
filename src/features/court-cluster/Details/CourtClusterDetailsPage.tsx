import { observer } from 'mobx-react-lite';
import { useStore } from '@/app/stores/store.ts';
import { useEffect, useRef, useState } from 'react';

import { useParams } from 'react-router-dom';

import { Tabs, TabList, TabPanels, Tab, TabPanel, useToast } from '@chakra-ui/react';
import CourtClusterDescriptionTab from './Tabs/CourtClusterDescriptionTab';
import CourtClusterDetailsHeaderComponent from './components/DetailsHeader/CourtClusterDetailsHeaderComponent';
import { accessibleTabs } from '@/app/common/const/detailsCourtClusterTabs';

const CourtClusterDetailsPage = observer(() => {
  const { courtClusterStore, bookingClusterStore, signalrStore, commonStore } = useStore();
  const { getDetailsCourtCluster } = courtClusterStore;
  const [selectedTabs, setSelectedTab] = useState(0);
  const chakraToast = useToast();
  const { id } = useParams();
  const isMounted = useRef(false);
  useEffect(() => {
    window.scroll(0, 0);
    if (id && Number(id)) {
      if (!isMounted.current) {
        isMounted.current = true;
      }
      courtClusterStore.loadCourtClusterListAll();
      getDetailsCourtCluster(id, chakraToast);
      bookingClusterStore.setCourtClusterId(Number(id));
      signalrStore.createConnection().then(async () => {
        await signalrStore.joinCourtClusterConnection(Number(id));
      });
    }
    return () => {
      if (isMounted.current) {
        signalrStore.leaveCourtCLusterGroup(Number(id));
        signalrStore.stopHubConnection();
        courtClusterStore.clearDetailsCourtCluster();
      }
    };
  }, [
    id,
    getDetailsCourtCluster,
    bookingClusterStore,
    signalrStore,
    chakraToast,
    courtClusterStore,
  ]);
  const tabs = accessibleTabs(commonStore.getRoles());

  return (
    <div className={'mt-6 pb-8'}>
      <CourtClusterDetailsHeaderComponent />
      <Tabs
        mt={4}
        colorScheme={'green'}
        index={selectedTabs}
        onChange={(index) => setSelectedTab(index)}
      >
        <TabList border={'none'}>
          <Tab>Chi tiết</Tab>
          {tabs.map((tab) => (
            <Tab key={tab.label}>{tab.label}</Tab>
          ))}
        </TabList>

        <TabPanels className="mt-8" minHeight={'50rem'}>
          <TabPanel p={0}>{selectedTabs === 0 && <CourtClusterDescriptionTab />}</TabPanel>
          {tabs.map((tab, index) => (
            <TabPanel p={0} key={index}>{selectedTabs === index + 1 && tab.component}</TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </div>
  );
});

export default CourtClusterDetailsPage;
