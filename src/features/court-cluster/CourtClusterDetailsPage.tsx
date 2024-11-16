import {observer} from "mobx-react";
import {useStore} from "@/app/stores/store.ts";
import {useEffect} from "react";

import {useParams} from "react-router-dom";
import CourtPageHeader from "@/features/court-cluster/components/CourtPageHeader.tsx";
import { Tabs, TabList, TabPanels, Tab, TabPanel, useToast } from '@chakra-ui/react'
import CourtClusterDescriptionTab from "@/features/court-cluster/tabs/CourtClusterDescriptionTab";
import CourtClusterProductsTab from "@/features/court-cluster/tabs/CourtClusterProductsTab";
import CourtClusterServicesTab from "@/features/court-cluster/tabs/CourtClusterServicesTab";
import CourtClusterBookingTab from "./tabs/CourtClusterBookingTab";

const CourtClusterDetailsPage = observer(() => {
    const {courtClusterStore, bookingClusterStore} = useStore();
    const {getDetailsCourtCluster, selectedTabs, setSelectedTab} = courtClusterStore;
    const chakraToast = useToast();
    const {id} = useParams();
    useEffect(() => {
        if (id && Number(id)) {
            getDetailsCourtCluster(id,chakraToast).finally();
            bookingClusterStore.setCourtClusterId(Number(id));
        }
    }, [id,getDetailsCourtCluster, bookingClusterStore, chakraToast])

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
                        {selectedTabs === 2 && id &&<CourtClusterProductsTab courtClusterId={Number(id)} />}
                    </TabPanel>
                    <TabPanel>
                        {selectedTabs === 3 && id &&<CourtClusterServicesTab courtClusterId={Number(id)} />}
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    );
});

export default CourtClusterDetailsPage;