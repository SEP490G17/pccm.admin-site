import {observer} from "mobx-react";
import {Box, Grid, GridItem, Heading, Skeleton} from "@chakra-ui/react";
import {useStore} from "@/app/stores/store.ts";
import {useEffect} from "react";
import ServiceCardItemComponent from "@/features/court-cluster/components/ServiceCardItemComponent.tsx";
interface  IProps{
    courtClusterId:string;
}
const CourtClusterServicesTab = observer(({courtClusterId}:IProps) => {
    const {courtClusterStore} =useStore();
    const {loadingServicesPage, loadServicesOfCourtCluster,serviceOfCourtClusterArray} =courtClusterStore;
    useEffect(() => {
        loadServicesOfCourtCluster(courtClusterId).then();
    }, [courtClusterId]);
    return (
        <Box>
            <Heading as={'h5'} size={'md'} className={'mb-5'}>Danh sách dịch vụ của cụm sân</Heading>
            {
                !loadingServicesPage &&

                <Grid templateColumns={'repeat(2,1fr)'} gap={4}>
                    {
                        serviceOfCourtClusterArray.map(
                            (service) => (
                                <ServiceCardItemComponent service={service}/>
                            )
                        )
                    }
                </Grid>
            }
            {
                loadingServicesPage &&
                <Grid templateColumns={'repeat(2,1fr)'} gap={4}>
                    {Array.from({ length: 6 }, (_, index) => (
                        <GridItem key={index}>
                            <Skeleton height="11rem" />
                        </GridItem>
                    ))}
                </Grid>
            }

        </Box>
    );
});

export default CourtClusterServicesTab;