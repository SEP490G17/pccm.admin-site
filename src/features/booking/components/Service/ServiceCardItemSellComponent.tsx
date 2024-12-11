import { Service } from '@/app/models/service.model.ts';
import { useStore } from '@/app/stores/store';
import { Flex, Grid, GridItem, Heading, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
interface IProps {
  service: Service;
  isEdit?: boolean;
}
const ServiceCardItemSellComponent = observer(({ service, isEdit = false }: IProps) => {
  const { bookingStore } = useStore();
  const { addServiceToOrder, selectedServiceItems, addServiceToOrderUpdate, updateServiceItems } =
    bookingStore;

  const isSelected = isEdit
    ? updateServiceItems.get(service.id) !== undefined
    : selectedServiceItems.get(service.id) !== undefined;

  return (
    <GridItem key={service.id} colSpan={{ base: 2, xl: 1 }}>
      <Grid
        templateRows={'repeat(6,1fr)'}
        className={`h-44  px-3 pb-3 pt-4 rounded-md cursor-pointer 
                        ${isSelected && 'bg-green-200'} `}
        gap={4}
        onClick={() => {
          if (isEdit) {
            addServiceToOrderUpdate(service.id);
          } else {
            addServiceToOrder(service.id);
          }
        }}
        style={{ boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px' }}
      >
        <GridItem rowSpan={2} className={'h-full flex items-center'}>
          <Heading fontSize={'1.5rem'} mb={1} fontWeight={'bold'}>
            {service.serviceName}
          </Heading>
        </GridItem>
        <GridItem rowSpan={4}>
          <Flex className={'flex-col py-2 gap-3 h-full'}>
            <Text
              fontWeight={'medium'}
              fontSize={'0.9rem'}
              style={{
                wordBreak: 'break-word', // Bẻ từ bất kỳ vị trí nào nếu quá dài
                overflowWrap: 'break-word', // Ngắt dòng tại từ nếu quá dài
                overflow: 'hidden', // Ẩn phần nội dung thừa
                textOverflow: 'ellipsis', // Thêm dấu "..." nếu cần
                display: '-webkit-box',
                WebkitLineClamp: 2, // Giới hạn số dòng
                WebkitBoxOrient: 'vertical',
              }}
            >
              Mô tả: {service.description}
            </Text>
            <Heading size={'sm'}>Giá tiền : {service.price} VND</Heading>
          </Flex>
        </GridItem>
      </Grid>
    </GridItem>
  );
});

export default ServiceCardItemSellComponent;
