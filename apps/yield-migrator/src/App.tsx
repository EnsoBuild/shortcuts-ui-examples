import Home from "@/components/Home";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Box, Flex } from "@chakra-ui/react";
import {useEffect} from "react";
import {setApiKey} from "@/service/enso.tsx";

function App() {
  useEffect(() => {
    setApiKey(import.meta.env.VITE_ENSO_API_KEY);
  }, []);
  return (
    <Box w={"full"} h={"full"}>
      <Flex marginY={2} justifyContent={"space-around"}>
        <div />
        <ConnectButton />
      </Flex>
      <Home />
    </Box>
  );
}

export default App;
