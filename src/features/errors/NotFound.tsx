import { Box, Button, Heading, HStack, Icon } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <Box  >
        <Heading >
            <Icon name='search'/> 
            Opps - We're looked everywhere but could not find what you are looking for!
        </Heading>
        <HStack>
            <Button as={Link} to='/activities'>
                Return to activities page
            </Button>
        </HStack>
    </Box>
  )
}

export default NotFound