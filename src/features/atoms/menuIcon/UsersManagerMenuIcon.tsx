import { Icon } from '@chakra-ui/react';
import React from 'react';
interface IProps {
  color: string;
  width: string;
  height: string;
}

function UsersManagerMenuIcon({ color, width, height }: IProps) {
  return (
    <Icon width={width} height={height} viewBox="0 0 24 24" color={color}>
      <path
        d="M9 2C6.38 2 4.25 4.13 4.25 6.75C4.25 9.32 6.26 11.4 8.88 11.49C8.96 11.48 9.04 11.48 9.1 11.49C9.12 11.49 9.13 11.49 9.15 11.49C9.16 11.49 9.16 11.49 9.17 11.49C11.73 11.4 13.74 9.32 13.75 6.75C13.75 4.13 11.62 2 9 2Z"
        fill="currentColor"
      />
      <path
        d="M14.08 14.1499C11.29 12.2899 6.74002 12.2899 3.93002 14.1499C2.66002 14.9999 1.96002 16.1499 1.96002 17.3799C1.96002 18.6099 2.66002 19.7499 3.92002 20.5899C5.32002 21.5299 7.16002 21.9999 9.00002 21.9999C10.84 21.9999 12.68 21.5299 14.08 20.5899C15.34 19.7399 16.04 18.5999 16.04 17.3599C16.03 16.1299 15.34 14.9899 14.08 14.1499Z"
        fill="currentColor"
      />
      <path
        d="M19.99 7.3401C20.15 9.2801 18.77 10.9801 16.86 11.2101C16.85 11.2101 16.85 11.2101 16.84 11.2101H16.81C16.75 11.2101 16.69 11.2101 16.64 11.2301C15.67 11.2801 14.78 10.9701 14.11 10.4001C15.14 9.4801 15.73 8.1001 15.61 6.6001C15.54 5.7901 15.26 5.0501 14.84 4.4201C15.22 4.2301 15.66 4.1101 16.11 4.0701C18.07 3.9001 19.82 5.3601 19.99 7.3401Z"
        fill="currentColor"
      />
      <path
        d="M21.99 16.5899C21.91 17.5599 21.29 18.3999 20.25 18.9699C19.25 19.5199 17.99 19.7799 16.74 19.7499C17.46 19.0999 17.88 18.2899 17.96 17.4299C18.06 16.1899 17.47 14.9999 16.29 14.0499C15.62 13.5199 14.84 13.0999 13.99 12.7899C16.2 12.1499 18.98 12.5799 20.69 13.9599C21.61 14.6999 22.08 15.6299 21.99 16.5899Z"
        fill="currentColor"
      />
    </Icon>
  );
}

export default UsersManagerMenuIcon;
