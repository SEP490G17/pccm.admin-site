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
            <Td key={`td${index}`} borderBottom={'0.923px solid #BDBDBD'} borderRight={'0.923px solid #BDBDBD'}>
              <Skeleton height="20px" borderRadius={'2rem'} />
            </Td>
          ))}

          <Td borderBottom={'0.923px solid #BDBDBD'}>
            <Skeleton height="20px" borderRadius={'2rem'} />
          </Td>
        </Tr>
      ))}
    </>
  );
}

export default SkeletonTableAtoms;
