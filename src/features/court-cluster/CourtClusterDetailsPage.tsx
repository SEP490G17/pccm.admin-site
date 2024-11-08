import {observer} from "mobx-react";
import {useStore} from "@/app/stores/store.ts";
import {useEffect} from "react";

import {useParams} from "react-router-dom";
import CourtPageHeader from "@/features/court-cluster/components/CourtPageHeader.tsx";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import CourtClusterDescriptionTab from "@/features/court-cluster/CourtClusterDescriptionTab.tsx";
import CourtClusterProductsTab from "@/features/court-cluster/CourtClusterProductsTab.tsx";
import CourtClusterServicesTab from "@/features/court-cluster/CourtClusterServicesTab.tsx";
import CourtClusterBookingTab from '@/features/court-cluster/CourtClusterBookingTab.tsx';

const CourtClusterDetailsPage = observer(() => {
    const {courtClusterStore} = useStore();
    const {getDetailsCourtCluster, selectedTabs, setSelectedTab} = courtClusterStore;

    const {id} = useParams();
    useEffect(() => {
        if (id) {
            getDetailsCourtCluster(id).finally();
        }
    }, [id,getDetailsCourtCluster])

    return (
        <div className={'mt-6 pb-8'}>
            <CourtPageHeader />
            <Tabs mt={4} colorScheme={'green'} index={selectedTabs} onChange={(index) => setSelectedTab(index)}>
                <TabList border={'none'}>
                    <Tab >Chi tiết</Tab>
                    <Tab >Booking</Tab>
                    <Tab >Sản phẩm</Tab>
                    <Tab >Dịch vụ</Tab>
                </TabList>

                <TabPanels  minHeight={'50rem'}>
                    <TabPanel>
                        {selectedTabs === 0 && <CourtClusterDescriptionTab />}
                    </TabPanel>
                    <TabPanel>
                        {selectedTabs === 1 && <CourtClusterBookingTab courtClusterId={Number(id)}/>}
                    </TabPanel>
                    <TabPanel>
                        {selectedTabs === 2 && id &&<CourtClusterProductsTab courtClusterId={id} />}
                    </TabPanel>
                    <TabPanel>
                        {selectedTabs === 3 && id &&<CourtClusterServicesTab courtClusterId={id} />}
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    );
});

export default CourtClusterDetailsPage;