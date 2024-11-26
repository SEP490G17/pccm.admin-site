import { useStore } from '@/app/stores/store.ts';
import { observer } from 'mobx-react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Skeleton,
  Text,
} from '@chakra-ui/react';
import { FaBowlFood, FaMapLocation, FaWifi } from 'react-icons/fa6';
import { FaCar, FaMotorcycle, FaStore } from 'react-icons/fa';
import { RiDrinks2Fill } from 'react-icons/ri';
import { customFormatTimeWithText } from '@/app/helper/utils.ts';
import CourtClusterImagesComponent from '../CourtClusterImagesComponent';
import { Link } from 'react-router-dom';
import PageHeadingAtoms from '@/features/atoms/PageHeadingAtoms';

const CourtClusterDetailsHeaderComponent = observer(() => {
  const { courtClusterStore } = useStore();

  const { selectedCourtCluster, loadingInitialDetailsPage } = courtClusterStore;
  if (!selectedCourtCluster) return;
  return (
    <Skeleton isLoaded={!loadingInitialDetailsPage || selectedCourtCluster !== undefined}>
      <PageHeadingAtoms
        breadCrumb={[
          { title: 'Cụm sân', to: '/cum-san' },
          {
            title: `Chi tiết cụm ${selectedCourtCluster.title}`,
            to: `/cum-san/${selectedCourtCluster.id}/chi-tiet`,
          },
        ]}
      />
      <Accordion allowToggle>
        <AccordionItem>
          <Flex justifyContent={'space-between'} className={'mb-2 mt-5'}>
            <Flex direction={'column'} gap={5}>
              <AccordionButton>
                <Heading>{selectedCourtCluster.title}</Heading>
                <AccordionIcon />
              </AccordionButton>
              <Flex direction={'row'} gap={2} className='cursor-pointer'>
                <FaMapLocation />
                <Text
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/search/?q=${selectedCourtCluster?.address}, ${selectedCourtCluster.wardName}, ${selectedCourtCluster.districtName}, ${selectedCourtCluster.provinceName}`,
                      '_blank',
                    )
                  }
                >
                  {[
                    selectedCourtCluster.address,
                    selectedCourtCluster.wardName,
                    selectedCourtCluster.districtName,
                    selectedCourtCluster.districtName,
                  ].join(', ')}
                </Text>
              </Flex>
            </Flex>
            <Flex direction="column" className="justify-end">
              <Flex direction="row" gap={5} justifyContent="center" className="mb-2">
                <Button
                  as={Link}
                  to={`/cum-san/${selectedCourtCluster.id}/quan-ly-san`}
                  colorScheme="blue"
                >
                  Quản lý sân
                </Button>
                <Button
                  as={Link}
                  to={`/cum-san/${selectedCourtCluster.id}/chinh-sua`}
                  colorScheme="blue"
                >
                  Chỉnh sửa thông tin
                </Button>
              </Flex>
            </Flex>
          </Flex>
          <AccordionPanel>
            <Grid
              className="min-h-[20rem] w-full"
              templateColumns={'repeat(24,1fr)'}
              templateRows={'repeat(2,1fr)'}
              gap={2}
            >
              <GridItem colSpan={{ base: 24, xl: 16 }} rowSpan={{ base: 1, xl: 2 }} gap={4}>
                {selectedCourtCluster && (
                  <CourtClusterImagesComponent images={selectedCourtCluster.images} />
                )}
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
                  <Grid
                    templateColumns={'repeat(2,1fr)'}
                    mt={4}
                    templateRows={'repeat(4,1fr)'}
                    gap={4}
                  >
                    {selectedCourtCluster && (
                      <>
                        <GridItem fontWeight="medium">
                          <Text>Giờ mở cứa:</Text>
                        </GridItem>
                        <GridItem textAlign={'end'}>
                          <Text>
                            {customFormatTimeWithText(selectedCourtCluster.openTime)} -{' '}
                            {customFormatTimeWithText(selectedCourtCluster?.closeTime)}
                          </Text>
                        </GridItem>
                        <GridItem fontWeight="medium">
                          <Text>Số sân thi đấu:</Text>
                        </GridItem>
                        <GridItem textAlign={'end'}>
                          <Text>{selectedCourtCluster?.numbOfCourts}</Text>
                        </GridItem>
                        <GridItem fontWeight="medium">
                          <Text>Giá sân từ:</Text>
                        </GridItem>
                        <GridItem textAlign={'end'}>
                          <Text>
                            {new Intl.NumberFormat('vi-VN').format(selectedCourtCluster.minPrice)}{' '}
                            VND
                          </Text>
                        </GridItem>
                        <GridItem fontWeight="medium">
                          <Text>Giá sân đến:</Text>
                        </GridItem>
                        <GridItem textAlign={'end'}>
                          <Text>
                            {new Intl.NumberFormat('vi-VN').format(selectedCourtCluster.maxPrice)}{' '}
                            VND
                          </Text>
                        </GridItem>
                      </>
                    )}
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
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Skeleton>
  );
});

export default CourtClusterDetailsHeaderComponent;
