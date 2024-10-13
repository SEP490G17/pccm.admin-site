import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Text,
} from "@chakra-ui/react";
import "./style.scss";
import { Form, Formik } from "formik";
import InputTag from "@/app/common/input/InputTag";
import FileUpload from "@/app/common/input/FileUpload";
import SelectComponent from "@/app/common/input/Select";
import ReactQuillComponent from "@/app/common/input/ReactQuill";
const CreateEventPage = () => {
  return (
    <div>
      <div className="linkPage">
        <Breadcrumb separator="/">
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className="prevPage">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href="#" className="prevPage">
              Danh sách tin tức
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="#" className="isCurrentPage">
              Tạo bài viết
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div style={{ marginLeft: "3.75rem", marginRight: "5rem" }}>
        <Text className="createEvents_header" mb="2rem">
          Tạo bài viết
        </Text>
        <Formik
          initialValues={{ title: "", description: "" }}
          onSubmit={(values) => {
            // handleSubmit(values);
            console.log(values);
          }}
        >
          {(props) => (
            <Form>
              <FormControl isRequired>
                <Grid templateColumns="9.5rem 1fr" alignItems="center" gap={2}>
                  <FormLabel className="title_label">
                    Tiêu đề bài viết
                  </FormLabel>
                  <Input
                    className="input_text"
                    type="text"
                    name="title"
                    placeholder="Nhập tiêu đề"
                    width='82.0625rem'
                  />
                </Grid>
              </FormControl>

              <Grid templateColumns="54.25rem 1fr" mt={2}>
                <FormControl>
                  <Grid
                    templateColumns="9.5rem 1fr"
                    alignItems="center"
                    gap={2}
                  >
                    <FormLabel className="title_label">Dòng mô tả</FormLabel>
                    <Input
                      name="description"
                      placeholder="Mô tả"
                      className="input_text"
                      type="text"
                      width='44.75rem'
                    />
                  </Grid>
                </FormControl>

                <FormControl pl="1.87rem">
                  <Grid templateColumns="13rem 1fr" alignItems="center">
                    <FormLabel className="title_label">
                      Tag ( Giới hạn 3 )
                    </FormLabel>
                    <InputTag />
                  </Grid>
                </FormControl>
              </Grid>

              <Grid templateColumns="54.25rem 1fr" mt={2}>
                <FormControl>
                  <Grid
                    templateColumns="9.5rem 1fr"
                    alignItems="center"
                    gap={2}
                  >
                    <FormLabel className="title_label">
                      Ảnh banner
                    </FormLabel>
                    <FileUpload name="images"></FileUpload>
                  </Grid>
                </FormControl>
                <FormControl pl="1.87rem">
                  <Grid templateColumns="13rem 1fr" alignItems="center" mt={2}>
                    <FormLabel className="title_label" mt={2}>
                      Danh mục bài viết
                    </FormLabel>
                    <SelectComponent items={[{ id: 1, name: 'Pickleball' }, { id: 2, name: 'FPT' }]}>
                    </SelectComponent>
                  </Grid>
                </FormControl>
              </Grid>
              <FormLabel className="title_label" mt={2}>
                Chi tiết bài viết
              </FormLabel>
              <Box display="flex" alignItems="flex-end">
                <Box flex="1">
                  <ReactQuillComponent />
                </Box>
                <Button
                  className="create"
                  isLoading={props.isSubmitting}
                  type="submit"
                  mr='0.5rem'
                >
                  Đăng bài
                </Button>
              </Box>

            </Form>
          )}
        </Formik>
      </div >
    </div >
  );
};

export default CreateEventPage;
