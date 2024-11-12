import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Image } from '@chakra-ui/react';
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
      <Breadcrumb separator={<Image src={arrowRight} w={4} h={4}/>} fontSize={'1rem'} pb={1} pt={1}>
        {breadCrumb.map(({ title, to }, index) => (
          <BreadcrumbItem key={index}>
            <BreadcrumbLink
              as={Link}
              style={{ textDecoration: 'none' }}
              to={to}
              className={to === location.pathname ? 'isCurrentPage' : 'prevPage'}
              fontSize={'1rem'}
              isCurrentPage={false}
            >
              {title}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
     
    </Box>
  );
}

export default PageHeadingAtoms;
