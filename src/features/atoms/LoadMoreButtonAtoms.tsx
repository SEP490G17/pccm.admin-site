import { Button, Flex } from '@chakra-ui/react';
import React from 'react';

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
          <Button colorScheme="teal" isLoading={loading} onClick={handleOnClick}>
            Xem thêm
          </Button>
        </Flex>
      )}
    </>
  );
}

export default LoadMoreButtonAtoms;
