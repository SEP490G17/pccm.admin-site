import FloatingInputAtom from "@/app/common/form/FloatingInputAtom";
import { Box, Button, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";

function LoginFormComponent() {
  return (
    <>
      <Formik
        initialValues={{ email: "" }}
        validate={(values) => {
          const errors: { email?: string } = {};
          if (!values.email) {
            errors.email = "Required";
          } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = "Invalid email address";
          }
          return errors;
        }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {() => (
          <Box px={{ base: 0, md: '115px' }}>
            <Form>
              <Box mb={4}>
                <FloatingInputAtom name="username" label="SDT/Email" height={'57px'} />
              </Box>
              <Box mb={4}>
                <FloatingInputAtom name="password" label="Mật khẩu" height={'57px'} type="password" />
              </Box>
              <Box mb={4}>
                <Button width={'100%'} className="login-card__button--submit" type="submit" colorScheme="primary" height={'57px'} >ĐĂNG NHẬP</Button>
              </Box>
            </Form>
          </Box>
        )}
      </Formik>
    </>
  );
}

export default LoginFormComponent;
