import { Alert, AlertDescription, AlertIcon, AlertTitle, Flex } from '@chakra-ui/react';

interface Props {
  errors: string[];
}
function ValidationError({ errors }: Props) {
  console.log(errors);

  return (
    <>
      {errors && (
        <Alert status="error">
          {errors && (
            <Flex direction="column">
              <Flex direction="row" marginBottom={2}>
                <AlertIcon marginRight={1} /> <AlertTitle>Validation Errors</AlertTitle>
              </Flex>
              <AlertDescription paddingLeft="6">
                <ul>
                  {errors.map((err: string, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Flex>
          )}
        </Alert>
      )}
    </>
  );
}

export default ValidationError;
