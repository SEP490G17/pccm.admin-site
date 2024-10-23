import { Icon } from '@chakra-ui/react';
import React from 'react';
interface IProps {
  color: string;
  width: string;
  height: string;
}

function PlusIcon({ color, width, height }: IProps) {
  return (
    <Icon width={width} height={height} viewBox="0 0 24 24" color={color}>
     
        <path
          d="M6 12H18"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M12 18V6"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
    </Icon>
  );
}

export default PlusIcon;
