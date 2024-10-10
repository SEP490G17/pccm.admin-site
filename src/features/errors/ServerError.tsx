import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import { Container, Heading, Wrap, WrapItem } from '@chakra-ui/react';

const ServerError = observer(function ServerError() {
  const { commonStore } = useStore();
  return (
    <Container>
      <Heading as="h1">Server Error</Heading>
      <Heading as="h5" color="red">
        {commonStore.error?.message}
      </Heading>
      {commonStore.error?.details && (
        <Wrap>
          <WrapItem>
            <Heading as="h4" content="Stack trace" color="teal" />
            <code className="mt-3">{commonStore.error.details}</code>
          </WrapItem>
        </Wrap>
      )}
    </Container>
  );
});

export default ServerError;
