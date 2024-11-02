import PageHeadingAtoms from "@/features/atoms/PageHeadingAtoms.tsx";
import {Form, Formik} from "formik";
import {
    Badge,
    Box,
    Button, Card, CardBody,
     Flex,
    FormControl,
    FormLabel,
    Grid,
    HStack,
    Input, Skeleton,
    Table, Tbody, Th, Thead, Tr
} from "@chakra-ui/react";
import ImageUpload from "@/app/common/input/ImageUpload.tsx";
import {IoMdAdd} from "react-icons/io";
import ReactQuillComponent from "@/app/common/input/ReactQuill.tsx";
import {useStore} from "@/app/stores/store.ts";
import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {observer} from "mobx-react";
import {TimePicker} from "antd";


const CourtClusterEditPage = observer(() => {
    const {courtClusterStore} = useStore();
    const {getDetailsCourtCluster, selectedCourt, loadingInitialDetailsPage} = courtClusterStore;

    const {id} = useParams();
    useEffect(() => {
        if (id) {
            if (!selectedCourt || (selectedCourt && selectedCourt.id !== Number(id))) {
                getDetailsCourtCluster(id).finally();
            }
        }
    }, [id, getDetailsCourtCluster])

    return (
        <Skeleton isLoaded={!loadingInitialDetailsPage}>
            <PageHeadingAtoms
                breadCrumb={[
                    {title: 'Danh sách cụm sân', to: '/cum-san'},
                    {title: `${selectedCourt?.title}`, to: `/cum-san/chi-tiet/${1}`},
                    {title: 'Chỉnh sửa', to: `/cum-san/chinh-sua/${selectedCourt?.id}`},
                ]}
            />
            <Card>
                <CardBody>

                    <Formik
                        initialValues={{title: '', description: ''}}
                        onSubmit={(values) => {
                            // handleSubmit(values);
                            console.log(values);
                        }}
                    >
                        {(props) => (
                            <Form>
                                <FormControl isRequired>
                                    <Grid templateColumns="10rem 1fr" alignItems="center" gap={2}>
                                        <FormLabel className="title_label_court">Tên cụm sân</FormLabel>
                                        <Input
                                            className="input_text"
                                            type="text"
                                            name="title"
                                            placeholder="Nhập tiêu đề"
                                            width="44.75rem"
                                        />
                                    </Grid>
                                </FormControl>

                                <FormControl mt="1.25rem">
                                    <Grid templateColumns="10rem 1fr" alignItems="center" gap={2}>
                                        <FormLabel className="title_label_court">Địa chỉ</FormLabel>
                                        <Input
                                            name="description"
                                            placeholder="Nhập địa chỉ"
                                            className="input_text"
                                            type="text"
                                            width="44.75rem"
                                        />
                                    </Grid>
                                </FormControl>

                                <FormControl mt="1.25rem">
                                    <FormLabel className="title_label_court">Thời gian</FormLabel>
                                    <HStack spacing="1rem">
                                        <Badge
                                            colorScheme="green"
                                            fontSize="1em"
                                            padding="8px 16px"
                                        >
                                            Giờ bắt đầu
                                        </Badge>
                                        <TimePicker
                                            name="startDate"
                                            placeholder={"--:--"}
                                            // onChange={handleChange}  
                                            format={'HH:mm'}
                                            size={'large'}
                                        />


                                        <Badge colorScheme="red" fontSize="1em" padding="8px 16px">
                                            Giờ kết thúc
                                        </Badge>

                                        <TimePicker
                                            name="endDate"
                                            placeholder={"--:--"}
                                            // onChange={handleChange}  
                                            format={'HH:mm'}
                                            size={'large'}
                                        />
                                    </HStack>
                                </FormControl>

                                <Grid templateColumns="54.25rem 1fr" mt="1.25rem">
                                    <FormControl>
                                        <Grid alignItems="center" gap={2}>
                                            <FormLabel className="title_label_court">Ảnh sân</FormLabel>
                                            <ImageUpload name="images"></ImageUpload>
                                        </Grid>
                                    </FormControl>
                                </Grid>

                                <FormControl mt="1.25rem">
                                    <FormLabel className="title_label_court">Danh sách sân</FormLabel>
                                    <Button margin="0.94rem 0" className="create_court">
                                        <IoMdAdd width="1.5rem" height="1.5rem"/>
                                        Thêm sân
                                    </Button>
                                    <Table variant="simple" className="table-layout">
                                        <Thead>
                                            <Tr>
                                                <Th>#</Th>
                                                <Th>Trạng thái</Th>
                                                <Th>Tên sân</Th>
                                                <Th>Khung giờ</Th>
                                                <Th>Giá tiền</Th>
                                                <Th colSpan={5}>Chức năng</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {/*{courtList.map((court) => (*/}
                                            {/*    <Tr key={court.id}>*/}
                                            {/*        <Td>{court.id}</Td>*/}
                                            {/*        <Td>{court.status}</Td>*/}
                                            {/*        <Td>{court.nameCourt}</Td>*/}
                                            {/*        <Td>{court.period}</Td>*/}
                                            {/*        <Td>{court.price} VND</Td>*/}
                                            {/*        <Td>*/}
                                            {/*            <IconButton*/}
                                            {/*                icon={<GrView/>}*/}
                                            {/*                aria-label="View"*/}
                                            {/*                colorScheme="gray"*/}
                                            {/*                size="sm"*/}
                                            {/*                mr={2}*/}
                                            {/*            />*/}
                                            {/*            <IconButton*/}
                                            {/*                icon={<FaEdit/>}*/}
                                            {/*                aria-label="Edit"*/}
                                            {/*                colorScheme="gray"*/}
                                            {/*                size="sm"*/}
                                            {/*                mr={2}*/}
                                            {/*            />*/}
                                            {/*            <IconButton*/}
                                            {/*                icon={<FaTrash/>}*/}
                                            {/*                aria-label="Delete"*/}
                                            {/*                colorScheme="gray"*/}
                                            {/*                size="sm"*/}
                                            {/*            />*/}
                                            {/*        </Td>*/}
                                            {/*    </Tr>*/}
                                            {/*))}*/}
                                        </Tbody>
                                    </Table>
                                </FormControl>
                                <FormControl mt="4.75rem">
                                    <FormLabel className="title_label_court">Mô tả sân</FormLabel>
                                    <Box>
                                        <Box>
                                            <ReactQuillComponent onChange={console.log}/>
                                        </Box>
                                        <Flex gap="0.78rem" justifyContent="flex-end">
                                            <Button className="delete" isLoading={props.isSubmitting} type="submit">
                                                Xóa
                                            </Button>
                                            <Button className="save" isLoading={props.isSubmitting} type="submit">
                                                Lưu
                                            </Button>
                                        </Flex>
                                    </Box>
                                </FormControl>
                            </Form>
                        )}
                    </Formik>
                </CardBody>
            </Card>
        </Skeleton>
    );
});

export default CourtClusterEditPage;