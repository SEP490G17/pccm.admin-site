import {IconButton, Tooltip, TooltipProps} from "@chakra-ui/react";


interface IProps extends Omit<TooltipProps, 'children'> {
    icon: any,
    className?: string,
    buttomSize?: string,
    buttonColorScheme?: string,
    buttonAriaLabel: string,
    handleOnclick?: () => void,
}

const TooltipButtonAtoms = ({icon, className, buttomSize="sm", buttonColorScheme, buttonAriaLabel, handleOnclick, ...props}: IProps) => {
    return (
        <>
            <Tooltip {...props}>
                <IconButton
                    className={className}
                    icon={icon}
                    aria-label={buttonAriaLabel}
                    colorScheme={buttonColorScheme}
                    size={buttomSize}
                    onClick={handleOnclick}
                />
            </Tooltip>
        </>
    );
};

export default TooltipButtonAtoms;