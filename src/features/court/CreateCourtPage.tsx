import {
  Badge,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  HStack,
  IconButton,
  Input,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import './style.scss';
import { Form, Formik } from 'formik';
import ReactQuillComponent from '@/app/common/input/ReactQuill';
import ImageUpload from '@/app/common/input/ImageUpload';
import { IoMdAdd } from 'react-icons/io';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { GrView } from 'react-icons/gr';
import PageHeadingAtoms from '../atoms/PageHeadingAtoms';

const courtList = [
  {
    id: 1,
    status: 'Hoạt động',
    nameCourt: 'Sân khu A',
    period: '7:00 - 9:00',
    price: '200.000',
  },
];

const CreateCourtPage = () => {
  return (
    <Flex direction="column" p={8} bg="#F4F4F4">
      <PageHeadingAtoms
        breadCrumb={[
          { title: 'Danh sách cụm sân', to: '/cum-san' },
          { title: 'Tạo sân', to: '/cum-san/tao' },
        ]}
      />
        <Formik
          initialValues={{ title: '', description: '' }}
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
                    sx={{ display: 'flex' }}
                    colorScheme="green"
                    fontSize="1em"
                    padding="8px 16px"
                  >
                    Giờ bắt đầu
                  </Badge>
                  <Input
                    type="time"
                    name="startDate"
                    // onChange={handleChange}
                    bg="#FFF"
                    width="10rem"
                  />

                  <Badge className="badge" colorScheme="red" fontSize="1em" padding="8px 16px">
                    Giờ kết thúc
                  </Badge>
                  <Input
                    type="time"
                    name="endDate"
                    // onChange={handleChange}
                    bg="#FFF"
                    width="10rem"
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
                <FormLabel className="title_label_court">Dịch vụ tiện ích</FormLabel>
                <Box className="services">
                  <Stack direction="row" justifyContent="space-between" width="100%">
                    <Stack gap="1rem" direction="column">
                      <Checkbox
                        size="lg"
                        colorScheme="blackAlpha"
                        color="var(--Color-Text-en, #262626)"
                        fontFamily="Roboto"
                        fontSize="1rem"
                        fontStyle="normal"
                        fontWeight="500"
                        lineHeight="1.5rem"
                      >
                        CT Kỳ họp
                      </Checkbox>
                      <Checkbox
                        size="lg"
                        colorScheme="blackAlpha"
                        color="var(--Color-Text-en, #262626)"
                        fontFamily="Roboto"
                        fontSize="1rem"
                        fontStyle="normal"
                        fontWeight="500"
                        lineHeight="1.5rem"
                      >
                        CT Kỳ họp
                      </Checkbox>
                      <Checkbox
                        size="lg"
                        colorScheme="blackAlpha"
                        color="var(--Color-Text-en, #262626)"
                        fontFamily="Roboto"
                        fontSize="1rem"
                        fontStyle="normal"
                        fontWeight="500"
                        lineHeight="1.5rem"
                      >
                        CT Kỳ họp
                      </Checkbox>
                      <Checkbox
                        size="lg"
                        colorScheme="blackAlpha"
                        color="var(--Color-Text-en, #262626)"
                        fontFamily="Roboto"
                        fontSize="1rem"
                        fontStyle="normal"
                        fontWeight="500"
                        lineHeight="1.5rem"
                      >
                        Xem thông tin chi tiết
                      </Checkbox>
                    </Stack>
                    <Stack gap="1rem" direction="column">
                      <Checkbox
                        size="lg"
                        colorScheme="blackAlpha"
                        color="var(--Color-Text-en, #262626)"
                        fontFamily="Roboto"
                        fontSize="1rem"
                        fontStyle="normal"
                        fontWeight="500"
                        lineHeight="1.5rem"
                      >
                        CT Kỳ họp
                      </Checkbox>
                      <Checkbox
                        size="lg"
                        colorScheme="blackAlpha"
                        color="var(--Color-Text-en, #262626)"
                        fontFamily="Roboto"
                        fontSize="1rem"
                        fontStyle="normal"
                        fontWeight="500"
                        lineHeight="1.5rem"
                      >
                        CT Kỳ họp
                      </Checkbox>
                      <Checkbox
                        size="lg"
                        colorScheme="blackAlpha"
                        color="var(--Color-Text-en, #262626)"
                        fontFamily="Roboto"
                        fontSize="1rem"
                        fontStyle="normal"
                        fontWeight="500"
                        lineHeight="1.5rem"
                      >
                        CT Kỳ họp
                      </Checkbox>
                      <Checkbox
                        size="lg"
                        colorScheme="blackAlpha"
                        color="var(--Color-Text-en, #262626)"
                        fontFamily="Roboto"
                        fontSize="1rem"
                        fontStyle="normal"
                        fontWeight="500"
                        lineHeight="1.5rem"
                      >
                        Xem thông tin chi tiết
                      </Checkbox>
                    </Stack>
                    <Stack gap="1rem" direction="column">
                      <Checkbox
                        size="lg"
                        colorScheme="blackAlpha"
                        color="var(--Color-Text-en, #262626)"
                        fontFamily="Roboto"
                        fontSize="1rem"
                        fontStyle="normal"
                        fontWeight="500"
                        lineHeight="1.5rem"
                      >
                        CT Kỳ họp
                      </Checkbox>
                      <Checkbox
                        size="lg"
                        colorScheme="blackAlpha"
                        color="var(--Color-Text-en, #262626)"
                        fontFamily="Roboto"
                        fontSize="1rem"
                        fontStyle="normal"
                        fontWeight="500"
                        lineHeight="1.5rem"
                      >
                        CT Kỳ họp
                      </Checkbox>
                      <Checkbox
                        size="lg"
                        colorScheme="blackAlpha"
                        color="var(--Color-Text-en, #262626)"
                        fontFamily="Roboto"
                        fontSize="1rem"
                        fontStyle="normal"
                        fontWeight="500"
                        lineHeight="1.5rem"
                      >
                        CT Kỳ họp
                      </Checkbox>
                      <Checkbox
                        size="lg"
                        colorScheme="blackAlpha"
                        color="var(--Color-Text-en, #262626)"
                        fontFamily="Roboto"
                        fontSize="1rem"
                        fontStyle="normal"
                        fontWeight="500"
                        lineHeight="1.5rem"
                      >
                        Xem thông tin chi tiết
                      </Checkbox>
                    </Stack>
                  </Stack>
                </Box>
              </FormControl>
              <FormControl mt="1.25rem">
                <FormLabel className="title_label_court">Danh sách sân</FormLabel>
                <Button margin="0.94rem 0" className="create_court">
                  <IoMdAdd width="1.5rem" height="1.5rem" />
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
                    {courtList.map((court) => (
                      <Tr key={court.id}>
                        <Td>{court.id}</Td>
                        <Td>{court.status}</Td>
                        <Td>{court.nameCourt}</Td>
                        <Td>{court.period}</Td>
                        <Td>{court.price} VND</Td>
                        <Td>
                          <IconButton
                            icon={<GrView />}
                            aria-label="View"
                            colorScheme="gray"
                            size="sm"
                            mr={2}
                          />
                          <IconButton
                            icon={<FaEdit />}
                            aria-label="Edit"
                            colorScheme="gray"
                            size="sm"
                            mr={2}
                          />
                          <IconButton
                            icon={<FaTrash />}
                            aria-label="Delete"
                            colorScheme="gray"
                            size="sm"
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </FormControl>
              <FormControl mt="4.75rem">
                <FormLabel className="title_label_court">Mô tả sân</FormLabel>
                <Box>
                  <Box>
                    <ReactQuillComponent />
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
    </Flex>
  );
};

export default CreateCourtPage;
