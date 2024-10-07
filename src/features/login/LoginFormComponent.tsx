import FloatingInputAtom from "@/app/common/form/FloatingInputAtom";
import { Box, Button, Checkbox, Flex, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import * as Yup from "yup";

function LoginFormComponent() {
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Email/SDT bắt buộc"),
    password: Yup.string().required("Password bắt buộc"),
  });

  return (
    <>
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {() => (
          <Box px={{ base: 0, md: "115px" }}>
            <Form>
              <Box mb={4}>
                <FloatingInputAtom
                  name="username"
                  label="SDT/Email"
                  height={"57px"}
                />
              </Box>
              <Box mb={4}>
                <FloatingInputAtom
                  name="password"
                  label="Mật khẩu"
                  height={"57px"}
                  type="password"
                />
              </Box>
              <Box mb={4}>
                <Button
                  width={"100%"}
                  className="login-card__button--submit"
                  type="submit"
                  colorScheme="primary"
                  height={"57px"}
                >
                  ĐĂNG NHẬP
                </Button>
              </Box>
            </Form>
            <Flex
              marginTop={"10"}
              width={"100%"}
              color={"#636363"}
              justifyContent={"space-between"}
            >
              <Flex gap="2" align={"center"} justifyContent={"center"}>
                <Checkbox /> Ghi nhớ đăng nhập
              </Flex>
              <Flex align={"center"} justifyContent={"center"}>
                <Link href="">Quên mật khẩu?</Link>
              </Flex>
            </Flex>
          </Box>
        )}
      </Formik>
    </>
  );
}

export default LoginFormComponent;
