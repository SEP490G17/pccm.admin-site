import {
    InputProps,
} from '@chakra-ui/react';
import React from 'react';
import { FaEdit } from 'react-icons/fa';
import TooltipButtonAtoms from "@/features/atoms/TooltipButtonAtoms.tsx";

interface EditProps extends InputProps {
    header?: string;
    onDelete: () => Promise<void>;
    buttonContent?: string;
    isIcon?: boolean;
    buttonSize?: string;
    buttonClassName?: string;
}

const EditButtonAtom: React.FC<EditProps> = ({ buttonSize = 'sm', isIcon = true, ...props }: EditProps) => {
    return (
        <>
            <TooltipButtonAtoms icon={isIcon && <FaEdit />} buttonAriaLabel={"Edit"} buttonColorScheme={'teal'} buttomSize={buttonSize}
                handleOnclick={props.onDelete}
                placement={'top'} bg={'teal'} color={'white'} label={'Sửa'} hasArrow={true}>
            </TooltipButtonAtoms>
        </>

    );
};

export default EditButtonAtom;
