import { Modal, Form, Input, Button, Row, Col } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';
import './style/ChangePasswordPopUp.scss';
import { useStore } from '@/app/stores/store';
import { ChangePasswordInput } from '@/app/models/account.model';
import { useToast } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

interface ChangePasswordPopUpProps {
  visible: boolean;
  onClose: () => void;
}

const ChangePasswordPopUp = observer(({ visible, onClose }: ChangePasswordPopUpProps) => {
  const { accountStore } = useStore();
  const { loadingChangePassword } = accountStore;
  const toast = useToast();
  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Vui lòng nhập mật khẩu hiện tại'),
    newPassword: Yup.string()
      .required('Mật khẩu không được bỏ trống')
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .matches(/[a-z]/, 'Mật khẩu phải chứa ít nhất 1 chữ thường')
      .matches(/[A-Z]/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa')
      .matches(/[0-9]/, 'Mật khẩu phải chứa ít nhất 1 chữ số')
      .matches(/[@$!%*?&]/, 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt'),
    confirmPassword: Yup.string()
      .required('Mật khẩu xác nhận không được bỏ trống')
      .oneOf([Yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp'),

  });

  return (
    <Modal
      title="Đổi mật khẩu"
      open={visible}
      onCancel={onClose}
      footer={null}
      className="change-password-modal"
      width="60%"
      destroyOnClose
    >
      <Formik
        initialValues={{ currentPassword: '', newPassword: '', confirmPassword: '' }}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          const changeInput = new ChangePasswordInput({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
          });

          const success = await accountStore.changePassword(changeInput, toast);
          if (success) {
            resetForm();
            onClose();
          }
        }}
      >
        {({ values, handleChange, handleSubmit, errors, touched }) => (
          <form onSubmit={handleSubmit} className="modal-body">
            <Row gutter={16}>
              <Col xs={24} sm={24} >
                <Form.Item
                  label="Mật khẩu hiện tại"
                  help={errors.currentPassword && touched.currentPassword ? errors.currentPassword : null}
                  validateStatus={touched.currentPassword && errors.currentPassword ? 'error' : ''}
                >
                  <Input.Password
                    name="currentPassword"
                    onChange={handleChange}
                    value={values.currentPassword}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} >
                <Form.Item
                  label="Mật khẩu mới"
                  help={errors.newPassword && touched.newPassword ? errors.newPassword : null}
                  validateStatus={touched.newPassword && errors.newPassword ? 'error' : ''}
                >
                  <Input.Password
                    name="newPassword"
                    onChange={handleChange}
                    value={values.newPassword}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} >
                <Form.Item
                  label="Xác nhận mật khẩu mới"
                  help={errors.confirmPassword && touched.confirmPassword ? errors.confirmPassword : null}
                  validateStatus={touched.confirmPassword && errors.confirmPassword ? 'error' : ''}
                >
                  <Input.Password
                    name="confirmPassword"
                    onChange={handleChange}
                    value={values.confirmPassword}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12} lg={12}>
                <Button type="default" onClick={onClose} block disabled={loadingChangePassword}>
                  Hủy
                </Button>
              </Col>
              <Col xs={24} sm={12} lg={12}>
                <Button type="default" style={{ backgroundColor: '#115363', color: 'white' }} htmlType="submit" block loading={loadingChangePassword}>
                  Xác nhận
                </Button>
              </Col>
            </Row>
          </form>
        )}
      </Formik>
    </Modal>
  );
});

export default ChangePasswordPopUp;
