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
    <Box>
      <Breadcrumb separator={<Image src={arrowRight} />} fontSize={'2rem'} pb={1} pt={1}>
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
      <Box>
        <Divider
          orientation="horizontal"
          marginBottom={'2rem'}
          background={'linear-gradient(90deg, #00423D 0%, #0A3351 100%)'}
          width={'9.3rem'}
          height={1}
        />
      </Box>
    </Box>
  );
}

export default PageHeadingAtoms;
