import { Service } from '@/app/models/service.model.ts';
import { useStore } from '@/app/stores/store';
import { Flex, Grid, GridItem, Heading, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react';
interface IProps {
  service: Service;
}
const ServiceCardItemSellComponent = observer(({ service }: IProps) => {
  const { orderStore } = useStore();
  const { addServiceToOrder, selectedServiceItems } = orderStore;
  return (
    <>
      <GridItem>
        <Grid
          templateRows={'repeat(6,1fr)'}
          className={`h-44  px-3 pb-3 pt-4 rounded-md cursor-pointer 
                        ${selectedServiceItems.get(service.id) !== undefined && 'bg-green-200'} `}
          gap={4}
          onClick={() => addServiceToOrder(service.id)}
          style={{boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px'}}
        >
          <GridItem rowSpan={2} className={'h-full flex items-center'}>
            <Heading fontSize={'1.5rem'} mb={1} fontWeight={'bold'}>
              {service.serviceName}
            </Heading>
          </GridItem>
          <GridItem rowSpan={4}>
            <Flex className={'flex-col py-2 gap-3 h-full'}>
              <Text fontWeight={'medium'} fontSize={'0.9rem'}>
                Mô tả: {service.description}
              </Text>
              <Heading size={'sm'}>Giá tiền : {service.price} VND</Heading>
            </Flex>
          </GridItem>
        </Grid>
      </GridItem>
    </>
  );
});

export default ServiceCardItemSellComponent;
