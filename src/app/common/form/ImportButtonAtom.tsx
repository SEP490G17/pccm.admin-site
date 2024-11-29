import {
    InputProps,
} from '@chakra-ui/react';
import React from 'react';
import { FaPlus } from 'react-icons/fa';
import TooltipButtonAtoms from "@/features/atoms/TooltipButtonAtoms.tsx";

interface ImportProps extends InputProps {
    header?: string;
    onImport: () => Promise<void>;
    buttonContent?: string;
    isIcon?: boolean;
    buttonSize?: string;
    buttonClassName?: string;
}

const ImportButtonAtom: React.FC<ImportProps> = ({ buttonSize = 'sm', isIcon = true, buttonContent = '', ...props }: ImportProps) => {
    return (
        <>
            <TooltipButtonAtoms icon={isIcon && <FaPlus color='white' />} buttonAriaLabel={"Edit"} buttonColorScheme={'blue'} buttomSize={buttonSize}
                handleOnclick={props.onImport} buttonContent={buttonContent}
                placement={'top'} bg={'blue.400'} color={'white'} label={'Nhập hàng'} hasArrow={true}>
            </TooltipButtonAtoms>
        </>

    );
};

export default ImportButtonAtom;
