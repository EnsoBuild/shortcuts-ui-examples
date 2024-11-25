"use client";

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  Image,
  IconButton,
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";

export default function LuckyDeFi() {
  return (
    <Container py={8} h={"full"} alignContent={"center"} w={"full"}>
      <Flex
        justify="space-around"
        mt={8}
        position={"absolute"}
        top={0}
        left={0}
        w={"full"}
      >
        <div/>
        <Button colorScheme="blackAlpha">Connect Wallet</Button>
      </Flex>

      <VStack spacing={4} align="stretch">
        <Heading size="lg" textAlign="center">
          I'm feeling lucky
        </Heading>
        <Text color="gray.500" textAlign="center">
          Randomly allocate your capital across the DeFi and meme tokens
        </Text>

        <Box borderWidth={1} borderRadius="lg" w="container.sm" p={4}>
          <Tabs variant="soft-rounded" colorScheme="gray" mb={4}>
            <TabList>
              <Tab>DeFi</Tab>
              <Tab>Memes</Tab>
            </TabList>
          </Tabs>

          <Box position="relative">
            <Text mb={2} color="gray.600">
              Swap from:
            </Text>
            <Flex align="center" mb={4}>
              <Flex
                border="1px"
                borderColor="gray.200"
                borderRadius="md"
                p={2}
                align="center"
                flex={1}
              >
                <Flex align="center" flex={1}>
                  <Image
                    src="/placeholder.svg?height=24&width=24"
                    alt="USDC"
                    width={6}
                    height={6}
                    mr={2}
                  />
                  <Select variant="unstyled" defaultValue="USDC" width="auto">
                    <option value="USDC">USDC</option>
                  </Select>
                </Flex>
                <Input
                  variant="unstyled"
                  placeholder="0.0"
                  textAlign="right"
                  type="number"
                  defaultValue="10000"
                />
              </Flex>
              <IconButton
                aria-label="Settings"
                icon={<SettingsIcon />}
                variant="ghost"
                ml={2}
              />
            </Flex>

            <Text color="gray.500" fontSize="sm" mb={1}>
              Available: 34991.8 USDC
            </Text>

            <VStack align="stretch" spacing={3}>
              <Flex justify="space-between">
                <Text color="gray.600">Exchange Rate:</Text>
                <Text>1 TKN = 0.00 TKN</Text>
              </Flex>

              <Flex justify="space-between">
                <Text color="gray.600">Slippage Tolerance:</Text>
                <Text>2%</Text>
              </Flex>

              <Flex justify="space-between">
                <Text color="gray.600">Gas:</Text>
                <Text>0.00 ETH</Text>
              </Flex>
            </VStack>

            <Button
              width="100%"
              bg="black"
              color="white"
              size="lg"
              mt={4}
              _hover={{ bg: "blackAlpha.800" }}
            >
              I'm feeling lucky
            </Button>

            <Text textAlign="center" color="gray.500" fontSize="sm" mt={2}>
              Terms & Conditions
            </Text>
          </Box>
        </Box>
      </VStack>
    </Container>
  );
}
