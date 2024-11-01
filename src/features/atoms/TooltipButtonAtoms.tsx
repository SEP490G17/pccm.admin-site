import {Button, Tooltip, TooltipProps} from "@chakra-ui/react";

interface IProps extends Omit<TooltipProps, 'children'> {
    buttonAriaLabel: string,
    buttonColorScheme: string,
    buttomSize: string,
    handleOnclick: ()=>void,
    className?: string,
    icon?:any,
    buttonContent?:string,
    
}

const TooltipButtonAtoms = ({className , icon, buttonAriaLabel, buttonColorScheme, buttomSize ="sm",buttonContent ,handleOnclick, ...props}: IProps) => {
    return (
        <>
            <Tooltip {...props}>
                <Button className={className}    size={buttomSize}
                        colorScheme={buttonColorScheme}
                        aria-label={buttonAriaLabel} onClick={handleOnclick}>

                    {icon}
                    {buttonContent}
                </Button>
            </Tooltip>
        </>
    );
};

export default TooltipButtonAtoms;