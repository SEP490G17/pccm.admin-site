import {
  Button,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import React, { FC } from 'react';

interface PaymentVNPButtonAtomProps {
  paymentUrl?: string;
}

const PaymentVNPButtonAtom: FC<PaymentVNPButtonAtomProps> = ({ paymentUrl }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {/* Button to open the modal */}
      <Link
        onClick={() => {
          onOpen();
        }}
      >
        vào đây
      </Link>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Website</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <iframe
              src="https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=1000000&vnp_Command=pay&vnp_CreateDate=20241113002916&vnp_CurrCode=VND&vnp_ExpireDate=20241113004416&vnp_IpAddr=116.96.47.6&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+thoi+gian%3A+2024-11-13+00%3A29%3A10&vnp_OrderType=topup&vnp_ReturnUrl=https%3A%2F%2Fsandbox.vnpayment.vn%2Ftryitnow%2FHome%2FVnPayReturn&vnp_TmnCode=CTTVNP01&vnp_TxnRef=217799&vnp_Version=2.1.1&vnp_SecureHash=2e7e279bb1e03b3dd54354e8bc14fd52ac1aad6a5415a0c8efdbd7628f8dede3890e10960d3e4900ad7556442662e2d583f5b9b773cf6a6ddf260bae56b5888169acc230e77e967a5dfb41b50d1f98caf39e08757bf8fd2ab898a26978335acb579b16c9165c8737235c096d35ce069b3131f5981c413d8e834c6b76ecc88fc1feabddd526701c1b87f810157c6944289a103c44e99263136df1434d0ba1063724d3eaf5f5a8576397a69d7c7b9859bb206e8380d5e59e0834aab8888b75772427b9eb2a054e440f92e48883e29327872b255e9173115e6e982ea22ffc0019c03c35d54add521df6cb68fad097c970e9d14c00887dd2f2e7fcdbd01c03190e3e&x-frame-options=ALLOW-FROM%20https://example.com"
              style={{ width: '100%', height: '80vh', border: 'none' }}
            ></iframe>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PaymentVNPButtonAtom;
