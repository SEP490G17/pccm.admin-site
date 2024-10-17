import { Box, Input, InputGroup, InputRightElement, Spinner } from '@chakra-ui/react';
import React from 'react';
import { FaSearch } from 'react-icons/fa';

interface IProp {
  handleChange(e: React.ChangeEvent<HTMLInputElement>): void;
  isPending: boolean;
}

const InputSearchBoxAtoms = ({ handleChange, isPending = false }: IProp) => {
    
  return (
    <Box textAlign="right">
      <Box color="#00423D" fontFamily="Roboto" fontSize="12px" mb="0.5rem">
        Tìm kiếm nâng cao
      </Box>
      <InputGroup
        size="md"
        alignItems="center"
        borderRadius="4px"
        border="0.5px solid #ADADAD"
        background="#FFF"
      >
        <Input
          placeholder="Nhập từ khóa tìm kiếm"
          pr="4.5rem"
          border="none"
          outline="none"
          borderRadius="4px"
          onChange={handleChange}
        />
        <InputRightElement width="4.5rem">
          {isPending ? <Spinner size={'sm'} /> : <FaSearch />}
        </InputRightElement>
      </InputGroup>
    </Box>
  );
};

export default InputSearchBoxAtoms;
