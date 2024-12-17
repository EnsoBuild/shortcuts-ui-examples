"use client";

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Tab,
  TabList,
  Tabs,
  Text,
  VStack,
  IconButton,
  Center,
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import { base } from "viem/chains";
import { useCallback, useMemo, useState } from "react";
import { useSwitchChain, useAccount } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";
import { Spoiler } from "spoiled";
import {
  useApproveIfNecessary,
  useErc20Balance,
  useNetworkId,
} from "./hooks/wallet";
import { useEnsoApprove, useSendEnsoTransaction } from "./hooks/enso";
import TokenSelector from "./components/TokenSelector";
import {
  denormalizeValue,
  formatNumber,
  normalizeValue,
} from "@enso/shared/util";
import WalletButton from "./components/WalletButton";
import { DEFI_LIST, MEMES_LIST, USDC_ADDRESSES } from "./constants";
import { useTokenFromList } from "./hooks/common";
import EoaModeSelector from "./components/EoaModeSelector";
import { Address } from "@enso/shared/types";

enum Category {
  defi,
  meme,
}

const CategoryList = {
  [Category.defi]: DEFI_LIST,
  [Category.meme]: MEMES_LIST,
};

const LuckyDeFi = () => {
  const [tokenIn, setTokenIn] = useState<Address>(
    USDC_ADDRESSES[base.id] as Address,
  );
  const [selectedCategory, setSelectedCategory] = useState(Category.meme);
  const chainId = useNetworkId();
  const tokenInData = useTokenFromList(tokenIn);
  const { switchChain } = useSwitchChain();
  const balance = useErc20Balance(tokenIn);
  const { ready, authenticated } = usePrivy();
  const { address } = useAccount();
  const [swapValue, setSwapValue] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const swapAmount = denormalizeValue(swapValue, tokenInData?.decimals);

  const approveData = useEnsoApprove(tokenIn, swapAmount);
  const approve = useApproveIfNecessary(
    tokenIn,
    approveData.data?.spender,
    swapAmount,
  );

  const randomMeme = useMemo(() => {
    const selectedList = CategoryList[selectedCategory];
    const index = Math.floor(Math.random() * selectedList.length);

    return selectedList[index] as Address;
  }, [selectedCategory]);

  const { sendTransaction: sendData, ensoData } = useSendEnsoTransaction(
    swapAmount,
    randomMeme,
    tokenIn,
    3000,
  );
  const selectedMeme = useTokenFromList(randomMeme as Address);

  const wrongChain = chainId !== base.id;
  const notEnoughBalance = tokenIn && +balance < +swapAmount;
  const needLogin = ready && !address;
  const exchangeRate =
    normalizeValue(ensoData?.amountOut, selectedMeme?.decimals) / +swapValue;
  const amountOut = normalizeValue(ensoData?.amountOut, selectedMeme?.decimals);
  const approveNeeded = !!approve && +swapAmount > 0 && !!tokenIn;

  const SpoilerComponent = useCallback(
    ({ children }) => (
      <Spoiler hidden={!revealed} onClick={() => setRevealed((val) => !val)}>
        {children}
      </Spoiler>
    ),
    [revealed],
  );

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
        <EoaModeSelector />

        <WalletButton />
      </Flex>

      <VStack spacing={4} align="flex-start" mt={-100}>
        <Heading size="lg" textAlign="center">
          I'm feeling lucky
        </Heading>
        <Text color="gray.500" textAlign="center">
          Randomly allocate your capital across the DeFi and meme tokens
        </Text>

        <Box borderWidth={1} borderRadius="lg" w="container.sm" p={4}>
          <Tabs
            variant="soft-rounded"
            colorScheme="gray"
            mb={4}
            onChange={(index) =>
              setSelectedCategory(
                (index as unknown as number) === 0
                  ? Category.meme
                  : Category.defi,
              )
            }
          >
            <TabList>
              <Tab borderRadius={2}>Memes</Tab>
              <Tab borderRadius={2}>DeFi</Tab>
            </TabList>
          </Tabs>

          <Box position="relative">
            <Text fontSize="sm" mb={2} color="gray.500">
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
                <Flex flexDirection="column">
                  <TokenSelector value={tokenIn} onChange={setTokenIn} />
                  <Text
                    color={notEnoughBalance ? "red" : "gray.500"}
                    fontSize="sm"
                    mb={1}
                    whiteSpace={"nowrap"}
                  >
                    Available: {normalizeValue(+balance, tokenInData?.decimals)}{" "}
                    {tokenInData?.symbol}
                  </Text>
                </Flex>
                <Input
                  type="number"
                  variant="unstyled"
                  placeholder="0.0"
                  textAlign="right"
                  value={swapValue}
                  onChange={(e) => setSwapValue(+e.target.value)}
                />
              </Flex>
              <IconButton
                aria-label="Settings"
                icon={<SettingsIcon />}
                variant="ghost"
                ml={2}
              />
            </Flex>

            <VStack align="stretch" spacing={3}>
              <Center>
                <Heading as={"h6"} size={"md"} color="gray.500">
                  You will receive:{" "}
                  <SpoilerComponent>
                    {formatNumber(amountOut)} {selectedMeme?.symbol}
                  </SpoilerComponent>
                </Heading>
              </Center>

              <Flex justify="space-between">
                <Text color="gray.600">Exchange Rate:</Text>
                <SpoilerComponent>
                  <Text>
                    1 {tokenInData?.symbol} ={" "}
                    {Number.isNaN(exchangeRate)
                      ? 0.0
                      : formatNumber(exchangeRate)}{" "}
                    {selectedMeme?.symbol}
                  </Text>
                </SpoilerComponent>
              </Flex>

              <Flex justify="space-between">
                <Text color="gray.600">Price impact:</Text>
                <Text>
                  {normalizeValue(ensoData?.priceImpact ?? 0, 4).toFixed(2)}%
                </Text>
              </Flex>

              <Flex justify="space-between">
                <Text color="gray.600">Gas:</Text>
                <Text>
                  {normalizeValue(ensoData?.gas ?? 0, 18).toFixed(2)} ETH
                </Text>
              </Flex>
            </VStack>

            <Flex mt={4} w={"full"} justifyContent={"center"}>
              {needLogin ? (
                <WalletButton />
              ) : (
                <Flex w={"full"} gap={4}>
                  {wrongChain ? (
                    <Button
                      width="100%"
                      bg="gray.700"
                      _hover={{ bg: "blackAlpha.800" }}
                      onClick={() => switchChain({ chainId: base.id })}
                    >
                      Switch to Base
                    </Button>
                  ) : (
                    approveNeeded && (
                      <Button
                        isLoading={approve.isLoading}
                        width="100%"
                        bg="gray.700"
                        _hover={{ bg: "blackAlpha.800" }}
                        onClick={approve.write}
                      >
                        Approve
                      </Button>
                    )
                  )}
                  <Button
                    variant="solid"
                    disabled={!!approve || wrongChain || !(+swapAmount > 0)}
                    width="100%"
                    // _hover={{ bg: "blackAlpha.800" }}
                    isLoading={sendData.isLoading}
                    onClick={sendData.send}
                  >
                    I'm feeling lucky
                  </Button>
                </Flex>
              )}
            </Flex>

            <Text textAlign="center" color="gray.500" fontSize="sm" mt={2}>
              Terms & Conditions
            </Text>
          </Box>
        </Box>
      </VStack>
    </Container>
  );
};

export default LuckyDeFi;
