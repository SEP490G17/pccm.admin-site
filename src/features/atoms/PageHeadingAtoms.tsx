import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Divider, Image } from '@chakra-ui/react';
import React from 'react';
import arrowRight from '@/assets/arrow-rignt.svg';
import { Link, useLocation } from 'react-router-dom';
interface IProp {
  breadCrumb: {
    title: string;
    to?: string;
  }[];
}
function PageHeadingAtoms({ breadCrumb }: IProp) {
  const location = useLocation();
  return (
    <>
      {/* <Heading
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
      </Heading> */}
      <Breadcrumb separator={<Image src={arrowRight} />} fontSize={'2rem'} pb={2}>
        {breadCrumb.map(({ title, to }, index) => (
          <BreadcrumbItem key={index}>
            <BreadcrumbLink
              as={Link}
              style={{ textDecoration: 'none' }}
              to={to}
              className={to === location.pathname ? 'isCurrentPage' : 'prevPage'}
              fontSize={'2rem'}
              isCurrentPage={false}
            >
              {title}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
      <Box position="relative">
        <Divider orientation="horizontal" marginBottom={'2rem'} />
        <Box position={'absolute'} left={0} bottom={0}>
          <Divider
            orientation="horizontal"
            marginBottom={'2rem'}
            background={'linear-gradient(90deg, #00423D 0%, #0A3351 100%)'}
            width={'9.3rem'}
            height={1}
          />
        </Box>
      </Box>
    </>
  );
}

export default PageHeadingAtoms;
