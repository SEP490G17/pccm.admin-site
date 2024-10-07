import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";
import { Container } from "@chakra-ui/react";

function App() {
  return (
    <>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      {location.pathname === "/" ? (
        <>main layout</>
      ) : (
        <>
          <Container maxW="container.xl" p={4}>
            <Outlet />
          </Container>{" "}
        </>
      )}
    </>
  );
}

export default App;
