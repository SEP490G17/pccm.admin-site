import { Box, Button, Flex, Heading, HStack, Icon } from "@chakra-ui/react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <Box>
      <Flex flexDirection={"row"} gap={2} mb={2}>
        <Heading>
          <Icon name="search" />
        </Heading>

        <Heading>
          Opps - We're looked everywhere but could not find what you are looking
          for!
        </Heading>
      </Flex>
      <Flex float={'inline-end'} p={2}>
        <Button as={Link} to="/">
          Return to home page
        </Button>
      </Flex>
    </Box>
  );
}

export default NotFound;
