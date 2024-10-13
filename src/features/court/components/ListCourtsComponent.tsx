import { Card, CardBody, Flex, Text } from "@chakra-ui/react"
import "./style.scss";
const ListCourtsComponent = () => {
    return (
        <div style={{ paddingLeft: '3.75rem' }}>
            <div className="courts__header">
                <Text className="courts">Danh sách cụm sân</Text>
            </div>
            <Flex>
                <Flex direction="column">
                    <Card className="card_left">
                        <CardBody>

                        </CardBody>
                    </Card>
                    <Card className="card_court" background='#D9D9D9'>
                        <CardBody>

                        </CardBody>
                    </Card>
                    <Card className="card_court" background='#D9D9D9'>
                        <CardBody>

                        </CardBody>
                    </Card>
                </Flex>
                <Flex>
                    <Card className="card-right">
                        <CardBody>

                        </CardBody>
                    </Card>
                </Flex>
            </Flex>
        </div>
    )
}

export default ListCourtsComponent