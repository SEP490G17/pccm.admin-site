import FloatingInputAtom from '@/app/common/form/FloatingInputAtom';
import { UserFormValues } from '@/app/models/user.model';
import { useStore } from '@/app/stores/store';
import { Box, Button, Checkbox, Flex, Link } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

class Login {
  username: string = '';
  password: string = '';

}

function LoginFormComponent() {
  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username/SDT bắt buộc'),
    password: Yup.string().required('Password bắt buộc'),
  });
  const { authStore } = useStore();
  const handleSubmit = async (value: UserFormValues, { isSubmitting }: any) => {
    await authStore.login(value).finally(() => (isSubmitting(false)));
  };
  return (
    <>
      <Formik
        initialValues={new Login()}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, isValid, isSubmitting }) => (
          <Box px={{ base: 0, lg: '7.188rem' }}>
            <Form onSubmit={handleSubmit}>
              <Box mb={4}>
                <FloatingInputAtom name="username" label="SDT/Username" height={'3.563rem'} />
              </Box>
              <Box mb={4}>
                <FloatingInputAtom
                  name="password"
                  label="Mật khẩu"
                  height={'3.563rem'}
                  type="password"
                />
              </Box>
              <Box mb={4}>
                <Button
                  width={'100%'}
                  className="login-card__button--submit"
                  type="submit"
                  colorScheme="primary"
                  height={'3.563rem'}
                  disabled={!isValid || isSubmitting}
                  isLoading={isSubmitting}
                >
                  ĐĂNG NHẬP
                </Button>
              </Box>
            </Form>
            <Flex
              marginTop={'10'}
              width={'100%'}
              color={'#636363'}
              justifyContent={'space-between'}
            >
              <Flex gap="2" align={'center'} justifyContent={'center'}>
                <Checkbox colorScheme="green" onChange={() => authStore.setRememberMe()} /> Ghi nhớ
                đăng nhập
              </Flex>
              <Flex align={'center'} justifyContent={'center'}>
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
