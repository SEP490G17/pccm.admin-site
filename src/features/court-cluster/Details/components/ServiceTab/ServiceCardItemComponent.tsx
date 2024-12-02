import { Service } from '@/app/models/service.model.ts';
import { Flex, Grid, GridItem, Heading, Text, useDisclosure, useToast } from '@chakra-ui/react';
import EditButtonAtom from '@/app/common/form/EditButtonAtom';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/app/stores/store';
import DeleteButtonAtom from '@/app/common/form/DeleteButtonAtom';
import UpdateServicePage from '@/features/service/UpdateServicePage';
interface IProps {
  service: Service;
}
const ServiceCardItemComponent = observer(({ service }: IProps) => {
  const { serviceStore, commonStore } = useStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const handleOpenEdit = async (id: number) => {
    onOpen();
    await serviceStore.detailService(id, toast);
  };
  return (
    <>
      <GridItem>
        <Grid
          templateRows={'repeat(8,1fr)'}
          className={'h-44 bg-white px-3 pb-3 pt-4 rounded-md'}
          gap={4}
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
              <Heading size={'sm'}>Giá tiền : {Number(service.price).toLocaleString('vn')} VND</Heading>
            </Flex>
          </GridItem>
          <GridItem rowSpan={2} className={'flex justify-end float-end'}>
            {commonStore.isEditSuppliesAble() && (
              <Flex justifyContent="flex-end" className={'items-end gap-2'}>
                <EditButtonAtom
                  onUpdate={async () => await handleOpenEdit(service.id)}
                  buttonSize={'md'}
                  buttonContent={'Sửa'}
                  name={'Hàng hoá'}
                  header="Chỉnh sửa"
                  buttonClassName="gap-2"
                ></EditButtonAtom>
                <DeleteButtonAtom
                  buttonSize={'md'}
                  name={'Hàng hóa'}
                  header={'Hàng hóa'}
                  loading={false}
                  buttonContent={'Xóa'}
                  buttonClassName={'gap-2 '}
                  onDelete={async () => {
                    await serviceStore.deleteService(service.id, toast);
                  }}
                />
              </Flex>
            )}
          </GridItem>
        </Grid>
      </GridItem>
      <UpdateServicePage isOpen={isOpen} onClose={onClose} />
    </>
  );
});

export default ServiceCardItemComponent;
