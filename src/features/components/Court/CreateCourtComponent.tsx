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
  import ReactQuillComponent from "@/app/common/input/ReactQuill";
import ImageUpload from "@/app/common/input/ImageUpload";
  const CreateCourtComponent = () => {
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
                Cụm sân
              </BreadcrumbLink>
            </BreadcrumbItem>
  
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href="#" className="isCurrentPage">
                Tạo sân
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
        <div style={{ marginLeft: "3.75rem", marginRight: "5rem" }}>
          <Text className="createEvents_header" mb="2rem">
            Tạo sân
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
                      Tên sân
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
                      <FormLabel className="title_label">Địa chỉ</FormLabel>
                      <Input
                        name="description"
                        placeholder="Nhập địa chỉ"
                        className="input_text"
                        type="text"
                        width='44.75rem'
                      />
                    </Grid>
                  </FormControl>
  
                  <FormControl pl="1.87rem">
                    <Grid templateColumns="13rem 1fr" alignItems="center">
                      <FormLabel className="title_label">
                        Thời gian
                      </FormLabel>
                      <Input type="date"/>
                    </Grid>
                  </FormControl>
                </Grid>
  
                <Grid templateColumns="54.25rem 1fr" mt={2}>
                  <FormControl>
                    <Grid
                      alignItems="center"
                      gap={2}
                    >
                      <FormLabel className="title_label">
                        Ảnh sân
                      </FormLabel>
                      <ImageUpload name="images"></ImageUpload>
                    </Grid>
                  </FormControl>
                </Grid>
                <FormLabel className="title_label" mt={2}>
                  Dịch vụ tiện ích
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
  
  export default CreateCourtComponent;
  