import { Flex } from '@chakra-ui/react';
import ButtonPrimaryAtoms from './ButtonPrimaryAtoms';

interface IProps {
  hidden: boolean;
  loading: boolean;
  handleOnClick: () => void;
}
function LoadMoreButtonAtoms({ hidden, loading, handleOnClick }: IProps) {
  return (
    <>
      {!hidden && (
        <Flex justifyContent="end" alignItems="center" mb="1rem">
          <ButtonPrimaryAtoms handleOnClick={handleOnClick} loading={loading}>
            Xem thêm
          </ButtonPrimaryAtoms>
        </Flex>
      )}
    </>
  );
}

export default LoadMoreButtonAtoms;
