import {Service} from "@/app/models/service.model.ts";
import {Button, Flex, Grid, GridItem, Heading, Text} from "@chakra-ui/react";
import DeleteButtonAtom from "@/app/common/form/DeleteButtonAtom.tsx";
interface IProps{
    service:Service
}
const ServiceCardItemComponent = ({service}:IProps) => {
    return (
        <>
            <GridItem>
                <Grid templateRows={'repeat(8,1fr)'} className={'h-44 bg-white px-3 pb-3 pt-4 rounded-md'} gap={4}>
                    <GridItem rowSpan={2} className={'h-full flex items-center'}>
                        <Heading fontSize={'1.5rem'} mb={1}
                                 fontWeight={'bold'}>{service.serviceName}</Heading>
                    </GridItem>
                    <GridItem rowSpan={4}>
                        <Flex className={'flex-col py-2 gap-3 h-full'}>
                          
                            <Text fontWeight={'medium'} fontSize={'0.9rem'}>
                                Mô tả: {service.description}</Text>
                            <Heading size={'sm'}>Giá tiền : {service.price} VND</Heading>

                        </Flex>
                    </GridItem>
                    <GridItem rowSpan={2} className={'flex justify-end float-end'}>
                        <Flex justifyContent="flex-end" className={'items-end gap-2'}>
                            <Button>Sửa</Button>
                            <DeleteButtonAtom
                                buttonSize={'md'} name={'Hàng hóa'} header={'Hàng hóa'} loading={false}
                                buttonContent={'Xóa'} buttonClassName={'gap-2 '} onDelete={async () => {
                               
                            }}/>
                        </Flex>
                    </GridItem>
                </Grid>
            </GridItem>   
        </>
    );
};

export default ServiceCardItemComponent;