import { Box, Divider, Heading } from '@chakra-ui/react';
import React from 'react';

interface IProp{
    title: string;
}
function PageHeadingAtoms({ title}:IProp) {
  return (
    <>
      <Heading
        as="h2"
        size="md"
        mb="16px"
        sx={{
          display: 'inline-flex',
          padding: '0.625rem 0px',
          alignItems: 'center',
          gap: '0.625rem',
          color: ' #0A3351',
          fontFamily: 'Roboto',
          fontSize: '2rem',
          fontWeight: '700',
          lineHeight: 'normal',
        }}
      >
        {title}
      </Heading>
      <Box position="relative">
        <Divider orientation="horizontal" marginBottom={'2rem'} />
        <Box position={'absolute'} left={0} bottom={0}>
          <Divider
            orientation="horizontal"
            marginBottom={'2rem'}
            background={'linear-gradient(90deg, #00423D 0%, #0A3351 100%)'}
            width={'7.5rem'}
            height={1}
          />
        </Box>
      </Box>
    </>
  );
}

export default PageHeadingAtoms;
