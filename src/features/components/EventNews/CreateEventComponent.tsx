import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  FormControl,
  FormLabel,
  Grid,
  Text,
} from "@chakra-ui/react";
import "./style.scss";
import { Form, Formik } from "formik";
import FloatingInputAtom from "@/app/common/form/FloatingInputAtom";
import InputTag from "@/app/common/input/InputTag";
// import DynamicInput from "@/app/common/form/Input"
const CreateEventComponent = () => {
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
        <Text className="createEvents_header" mb='2rem'>Tạo bài viết</Text>
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
                  <FormLabel className="title_label">Tiêu đề bài viết</FormLabel>
                  <FloatingInputAtom
                    name="title"
                    placeholder="Nhập tiêu đề"
                    width="82.0625rem"
                    height="3rem"
                    flexShrink={0}
                  />
                </Grid>
              </FormControl>

                <Grid templateColumns="54.25rem 1fr">
                  <FormControl>
                    <Grid templateColumns="9.5rem 1fr" alignItems="center" gap={2} mt={2}>
                      <FormLabel className="title_label">Dòng mô tả</FormLabel>
                      <FloatingInputAtom
                        name="description"
                        placeholder="Mô tả"
                        height="3rem"
                      />
                    </Grid>
                  </FormControl>

                  <FormControl pl='1.87rem'>
                    <Grid templateColumns="13rem 1fr" alignItems="center" mt={2}>
                      <FormLabel className="title_label" mt={2}>Tag ( Giới hạn 3 )</FormLabel>
                      <InputTag />
                    </Grid>
                  </FormControl>
                </Grid>
                <FormControl>
                <Grid templateColumns="9.5rem 1fr" alignItems="center" gap={2} mt={2}>
                  <FormLabel className="title_label">Ảnh banner</FormLabel>
                </Grid>
              </FormControl>
              <Button
                mt={4}
                colorScheme="teal"
                isLoading={props.isSubmitting}
                type="submit"
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateEventComponent;
