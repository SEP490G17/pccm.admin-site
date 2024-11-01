import { useStore } from '@/app/stores/store.ts';
import { observer } from 'mobx-react';
import ListImageComponent from '@/features/court-cluster/components/ListImageComponent.tsx';
import { Card, Divider, Flex, Grid, GridItem, Heading, Skeleton, Text } from '@chakra-ui/react';
import { FaBowlFood, FaWifi } from 'react-icons/fa6';
import { FaCar, FaMotorcycle, FaStore } from 'react-icons/fa';
import { RiDrinks2Fill } from 'react-icons/ri';

const CourtPageHeader = observer(() => {
  const { courtClusterStore } = useStore();

  const { selectedCourt, loadingInitialDetailsPage } = courtClusterStore;

  return (
    <Skeleton isLoaded={!loadingInitialDetailsPage}>
      <Grid
        className="min-h-[20rem] w-full"
        templateColumns={'repeat(24,1fr)'}
        templateRows={'repeat(2,1fr)'}
        gap={2}
      >
        <GridItem colSpan={{ base: 24, xl: 16 }} rowSpan={{ base: 1, xl: 2 }} gap={4}>
          {selectedCourt && <ListImageComponent images={selectedCourt.images} />}
        </GridItem>
        <GridItem colSpan={{ base: 24, xl: 8 }} rowSpan={{ base: 1, xl: 2 }}>
          <Card className={'h-full w-full'} px={3.5} py={4}>
            <Flex direction={'row'} gap={2} alignItems={'center'}>
              <Divider
                className={'bg-primary-700'}
                width={'0.25rem'}
                height={'1.2rem'}
                orientation="vertical"
              />
              <Heading size={'md'}>Thông tin sân</Heading>
            </Flex>
            <Grid templateColumns={'repeat(2,1fr)'} mt={4} templateRows={'repeat(4,1fr)'} gap={4}>
              <GridItem fontWeight="medium">
                <Text>Giờ mở cứa:</Text>
              </GridItem>
              <GridItem textAlign={'end'}>
                <Text>6h-23h</Text>
              </GridItem>
              <GridItem fontWeight="medium">
                <Text>Số sân thi đấu:</Text>
              </GridItem>
              <GridItem textAlign={'end'}>
                <Text>Giờ mở cứa</Text>
              </GridItem>
              <GridItem fontWeight="medium">
                <Text>Giá sân:</Text>
              </GridItem>
              <GridItem textAlign={'end'}>
                <Text>120.000 đ</Text>
              </GridItem>
              <GridItem fontWeight="medium">
                <Text>Giá sân giờ vàng:</Text>
              </GridItem>
              <GridItem textAlign={'end'}>
                <Text>120.000 đ</Text>
              </GridItem>
            </Grid>
            <Grid
              className={'w-full bg-gray-100'}
              templateColumns={'repeat(2,1fr)'}
              mt={4}
              templateRows={'repeat(5,1fr)'}
              gap={4}
              rounded={'md'}
              py={3}
              px={5}
            >
              <GridItem colSpan={2}>
                <Heading size={'sm'}>Dịch vụ tiện ích</Heading>
              </GridItem>
              <GridItem className={'flex flex-row gap-2 items-center justify-start'}>
                <FaWifi /> Wifi
              </GridItem>
              <GridItem className={'flex flex-row gap-2 items-center justify-start'}>
                <FaMotorcycle />
                Bãi đỗ xe máy
              </GridItem>
              <GridItem className={'flex flex-row gap-2 items-center justify-start'}>
                <FaCar />
                Bãi đỗ xe ô tô
              </GridItem>
              <GridItem className={'flex flex-row gap-2 items-center justify-start'}>
                <FaBowlFood />
                Đồ ăn
              </GridItem>
              <GridItem className={'flex flex-row gap-2 items-center justify-start'}>
                <RiDrinks2Fill />
                Đồ uống
              </GridItem>
              <GridItem className={'flex flex-row gap-2 items-center justify-start'}>
                <FaStore />
                Căng tin
              </GridItem>
              {/* <GridItem className={'flex flex-row gap-2 items-center justify-start'}>
                                <FaWifi/> Wifi</GridItem>
                            <GridItem className={'flex flex-row gap-2 items-center justify-start'}>
                                <FaWifi/> Wifi</GridItem> */}
            </Grid>
          </Card>
        </GridItem>
      </Grid>
    </Skeleton>
  );
});

export default CourtPageHeader;
