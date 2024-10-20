import { Skeleton, Td, Tr } from '@chakra-ui/react';
import React from 'react';

interface IProp {
  numOfColumn: number;
  pageSize: number;
}

function SkeletonTableAtoms({ numOfColumn, pageSize }: IProp) {
  return (
    <>
      {Array.from({ length: pageSize }, (_,index) => (
        <Tr key={`tr${index}`}>
          {Array.from({ length: numOfColumn }, (_,index) => (
            <Td key={`td${index}`} height={'5.7rem'}>
              <Skeleton height="20px" borderRadius={'2rem'} />
            </Td>
          ))}

          <Td>
            <Skeleton height="20px" borderRadius={'2rem'} />
          </Td>
        </Tr>
      ))}
    </>
  );
}

export default SkeletonTableAtoms;
