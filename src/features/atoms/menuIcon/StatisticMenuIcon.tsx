import { Icon } from '@chakra-ui/react';
import React from 'react';
interface IProps {
  color: string;
  width: string;
  height: string;
}

function StatisticMenuIcon({ color, width, height }: IProps) {
  return (
    <Icon width={width} height={height} viewBox="0 0 24 24" color={color}>
      <path
        d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM9.91 16.19C9.91 16.83 9.39 17.35 8.74 17.35C8.1 17.35 7.58 16.83 7.58 16.19V12.93C7.58 12.29 8.1 11.77 8.74 11.77C9.39 11.77 9.91 12.29 9.91 12.93V16.19ZM16.42 16.19C16.42 16.83 15.9 17.35 15.26 17.35C14.61 17.35 14.09 16.83 14.09 16.19V7.81C14.09 7.17 14.61 6.65 15.26 6.65C15.9 6.65 16.42 7.17 16.42 7.81V16.19Z"
        fill="currentColor"
      />
    </Icon>
  );
}

export default StatisticMenuIcon;