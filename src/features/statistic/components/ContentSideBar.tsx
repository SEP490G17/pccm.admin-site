import { Box, VStack, Heading, Image } from "@chakra-ui/react";
import pickerball from "@/assets/pickleball-icon-1.png";
import "./style.scss"
import { DataTotal } from "@/app/models/statistic.model";

interface IProps {
    data: DataTotal | undefined
}

export default function ContentSidebar({ data }: IProps) {
    return (
        <div>
            <Box width="25rem" className="side-card" position="relative" padding="4" boxShadow="md" borderRadius="md">
                <VStack spacing="6" align="flex-start">
                    <Heading size="lg" color={"white"}>
                        Hôm nay
                    </Heading>
                    <Heading size="md" color={"white"} style={{ 'marginTop': '-15px' }}>
                        {data?.totalBookingToday} lượt đặt
                    </Heading>
                    <Heading size="lg" color={"white"}>
                        Tháng này
                    </Heading>
                    <Heading size="md" color={"white"} style={{ 'marginTop': '-15px' }}>
                        {data?.totalBookingMonth} lượt đặt
                    </Heading>
                </VStack>
                <Image
                    src={pickerball}
                    style={{
                        position: "absolute",
                        bottom: "-20px",
                        right: "-10px",
                        height: "140px",
                        width: "auto",
                    }}
                    alt=""
                />
            </Box>
        </div>
    );
}
