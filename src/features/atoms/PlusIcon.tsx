import { Icon } from '@chakra-ui/react';
interface IProps {
  color: string;
  width: string;
  height: string;
}

function PlusIcon({ color, width, height }: Readonly<IProps>) {
  return (
    <Icon width={width} height={height} viewBox="0 0 24 24" color={color}>
     
        <path
          d="M6 12H18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 18V6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
    </Icon>
  );
}

export default PlusIcon;
