import {Box, Grid, GridItem, Heading, Skeleton} from "@chakra-ui/react";
import {observer} from "mobx-react";

import {useStore} from "@/app/stores/store.ts";
import {useEffect} from "react";
import ProductCardItemSellComponent from "./ProductCardItemSellComponent";
interface IProps{
    courtClusterId: number;
}
const BookingProductTab = observer(({courtClusterId}:IProps) => {
    const {courtClusterStore} = useStore();
    const {
        loadProductsOfCourtCluster,
        productOfCourtClusterArray,
        productOfClusterRegistry,
        loadingProductsPage
    } = courtClusterStore;
    
    useEffect(() => {
        if (productOfClusterRegistry.size == 0) {
            loadProductsOfCourtCluster(courtClusterId);
            console.log(courtClusterId);
        }
    }, [])

    return (
        <Box >

            <Heading as={'h5'} size={'md'} className={'mb-5'}>
                Danh sách hàng hóa thuộc cụm sân
            </Heading>
            {
                !loadingProductsPage &&

                <Grid templateColumns={'repeat(2,1fr)'} p={2} gap={4} maxHeight={'40rem'} overflow={'scroll'}>
                    {
                        productOfCourtClusterArray.map(
                            (product) => (
                                <ProductCardItemSellComponent key={product.id} product={product}/>
                            )
                        )
                    }
                </Grid>
            }
            {
                loadingProductsPage &&
                <Grid templateColumns={'repeat(2,1fr)'} gap={4} >
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

export default BookingProductTab;