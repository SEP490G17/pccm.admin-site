import { useState } from "react";
import ValidationError from "./ValidationError";
import { Box, Button, ButtonGroup, Heading } from "@chakra-ui/react";
import agent from "../../app/api/agent";

export default function TestErrors() {
  const baseUrl = import.meta.env.VITE_API_URL;
  const [errors, setErrors] = useState(null);
  function handleNotFound() {
    console.log('start')
    agent.requests
      .get(baseUrl + "buggy/not-found");
      }

  function handleBadRequest() {
    agent.requests
      .get(baseUrl + "buggy/bad-request")
      .catch((err) => console.log(err.response));
  }

  function handleServerError() {
    agent.requests
      .get(baseUrl + "buggy/server-error")
      .catch((err) => console.log(err.response));
  }

  function handleUnauthorised() {
    agent.requests
      .get(baseUrl + "buggy/unauthorised")
      .catch((err) => console.log(err.response));
  }

  function handleBadGuid() {
    agent.requests
      .get(baseUrl + "activities/notaguid")
      .catch((err) => console.log(err.response));
  }

  function handleValidationError() {
    agent.requests.post(baseUrl + "activities", {}).catch((err) => {
      console.log("axios", err);
      setErrors(err);
    });
  }
  const handleActivity = () =>{
    agent.Activities.list().then(console.log);
  }

  return (
    <>
      <Heading as="h1">Test Error component</Heading>
      <Box p={4} borderWidth={1} borderRadius="md" boxShadow="sm">
        <ButtonGroup spacing={3} width="100%">
          <Button onClick={handleNotFound} colorScheme="blue" variant="outline">
            Not Found
          </Button>
          <Button
            onClick={handleBadRequest}
            colorScheme="blue"
            variant="outline"
          >
            Bad Request
          </Button>
          <Button
            onClick={handleValidationError}
            colorScheme="blue"
            variant="outline"
          >
            Validation Error
          </Button>
          <Button
            onClick={handleServerError}
            colorScheme="blue"
            variant="outline"
          >
            Server Error
          </Button>
          <Button
            onClick={handleUnauthorised}
            colorScheme="blue"
            variant="outline"
          >
            Unauthorised
          </Button>
          <Button onClick={handleBadGuid} colorScheme="green" variant="outline">
            Bad Guid
          </Button>
          <Button onClick={handleActivity} colorScheme="green" variant="outline">
            Test Activities
          </Button>
        </ButtonGroup>
      </Box>
      {errors && <ValidationError errors={errors} />}
    </>
  );
}
