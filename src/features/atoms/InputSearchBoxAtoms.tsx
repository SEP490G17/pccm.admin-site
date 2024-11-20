import { Box, Input, InputGroup, InputRightElement, Spinner } from '@chakra-ui/react';
import React from 'react';
import { FaSearch } from 'react-icons/fa';

interface IProp {
  handleChange(e: React.ChangeEvent<HTMLInputElement>): void;
  isPending: boolean;
  value?: string;
}

const InputSearchBoxAtoms = ({ handleChange, isPending = false, value  }: IProp) => {
    
  return (
    <Box textAlign="right">
      <InputGroup
        size="md"
        alignItems="center"
        borderRadius="md"
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
          defaultValue={value}
        />
        <InputRightElement width="4.5rem">
          {isPending ? <Spinner size={'sm'} /> : <FaSearch />}
        </InputRightElement>
      </InputGroup>
    </Box>
  );
};

export default InputSearchBoxAtoms;
