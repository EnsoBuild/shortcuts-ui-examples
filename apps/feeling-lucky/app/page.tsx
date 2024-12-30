"use client";

import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  Center,
  Input,
  HStack,
  RadioCard,
} from "@chakra-ui/react";
import { base } from "viem/chains";
import { useCallback, useMemo, useState } from "react";
import { useSwitchChain, useAccount } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";
import { Spoiler } from "spoiled";
import {
  useApproveIfNecessary,
  useNetworkId,
  useSendEnsoTransaction,
  useTokenBalance,
} from "@/util/hooks/wallet";
import { useEnsoApprove, useEnsoQuote } from "@/util/hooks/enso";
import {
  denormalizeValue,
  formatNumber,
  normalizeValue,
} from "@ensofinance/shared/util";
import { DEFI_LIST, MEMES_LIST, USDC_ADDRESSES } from "@/util/constants";
import { useTokenFromList } from "@/util/hooks/common";
import TokenSelector from "@/components/TokenSelector";
import WalletButton from "@/components/WalletButton";
import { Address } from "@ensofinance/shared/types";
import { Button } from "@/components/ui/button";
import { ColorModeButton } from "@/components/ui/color-mode";

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
  const [selectedCategory, setSelectedCategory] = useState(
    Category.meme.toString(),
  );
  const chainId = useNetworkId();
  const tokenInInfo = useTokenFromList(tokenIn);
  const { switchChain } = useSwitchChain();
  const balance = useTokenBalance(tokenIn);
  const { ready } = usePrivy();
  const { address } = useAccount();
  const [swapValue, setSwapValue] = useState(10);
  const [revealed, setRevealed] = useState(false);

  const swapAmount = denormalizeValue(swapValue, tokenInInfo?.decimals);

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

  const { sendTransaction: sendData } = useSendEnsoTransaction(
    swapAmount,
    randomMeme,
    tokenIn,
    3000,
  );
  const tokenOutInfo = useTokenFromList(randomMeme as Address);

  const wrongChain = chainId !== base.id;
  const notEnoughBalance = tokenIn && +balance < +swapAmount;
  const needLogin = ready && !address;
  const approveNeeded = !!approve && +swapAmount > 0 && !!tokenIn;

  const SpoilerComponent = useCallback(
    ({ children }) => (
      <Spoiler
        density={0.5}
        hidden={!revealed}
        onClick={() => setRevealed((val) => !val)}
      >
        {children}
      </Spoiler>
    ),
    [revealed],
  );

  const { data: quoteData } = useEnsoQuote({
    chainId: base.id,
    fromAddress: address,
    amountIn: swapAmount,
    tokenIn: tokenIn,
    tokenOut: randomMeme,
    routingStrategy: "router",
  });
  const valueOut = normalizeValue(
    +quoteData?.amountOut,
    tokenOutInfo?.decimals,
  );
  const exchangeRate = +valueOut / +swapValue;

  return (
    <Container py={8} h={"full"} w={"full"}>
      <Flex justify="space-around" w={"full"}>
        {/*<EoaModeSelector />*/}
        <ColorModeButton />

        <WalletButton />
      </Flex>

      <Center h={"full"}>
        <VStack gap={4} align="flex-start" mt={-100}>
          <Heading size="lg" textAlign="center">
            I'm feeling lucky
          </Heading>
          <Text color="gray.500" textAlign="center">
            Randomly allocate your capital across the DeFi and meme tokens
          </Text>

          <Box borderWidth={1} borderRadius="lg" w="container.sm" p={4}>
            <RadioCard.Root
              variant={"subtle"}
              colorPalette={"gray"}
              size={"sm"}
              mb={4}
              value={selectedCategory}
            >
              <HStack align="stretch" w={150}>
                {Object.keys(CategoryList).map((key) => (
                  <RadioCard.Item
                    display={"flex"}
                    w={"full"}
                    key={key}
                    value={key}
                    border={"none"}
                    onClick={() => setSelectedCategory(key.toString())}
                    alignItems={"center"}
                  >
                    <RadioCard.ItemHiddenInput />
                    <RadioCard.ItemControl minW={"80px"} justifyContent={"center"}>
                      <RadioCard.ItemText>
                        {Category[key][0].toUpperCase() +
                          Category[key].slice(1)}
                      </RadioCard.ItemText>
                    </RadioCard.ItemControl>
                  </RadioCard.Item>
                ))}
              </HStack>
            </RadioCard.Root>

            <Box position="relative">
              <Text fontSize="sm" color="gray.500">
                Swap from:
              </Text>
              <Flex align="center" mb={4}>
                <Flex
                  border="solid 1px"
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
                      visibility={address ? "visible" : "hidden"}
                    >
                      Available:{" "}
                      {formatNumber(
                        normalizeValue(+balance, tokenInInfo?.decimals),
                      )}{" "}
                      {tokenInInfo?.symbol}
                    </Text>
                  </Flex>
                  <Input
                    fontSize="xl"
                    // variant="subtle"
                    border={"none"}
                    outline={"none"}
                    placeholder="0.0"
                    textAlign="right"
                    value={swapValue}
                    onChange={(e) => setSwapValue(+e.target.value)}
                    mr={5}
                  />
                </Flex>
                {/*<IconButton*/}
                {/*  aria-label="Settings"*/}
                {/*  icon={<SettingsIcon />}*/}
                {/*  variant="ghost"*/}
                {/*  ml={2}*/}
                {/*/>*/}
              </Flex>

              <VStack align="stretch" gap={3}>
                <Center>
                  <Heading as={"h6"} size={"md"} color="gray.500">
                    You will receive:{" "}
                    <SpoilerComponent>
                      {formatNumber(valueOut)} {tokenOutInfo?.symbol}
                    </SpoilerComponent>
                  </Heading>
                </Center>

                <Flex justify="space-between">
                  <Text color="gray.600">Exchange Rate:</Text>
                  <SpoilerComponent>
                    <Text>
                      1 {tokenInInfo?.symbol} = {formatNumber(exchangeRate)}{" "}
                      {tokenOutInfo?.symbol}
                    </Text>
                  </SpoilerComponent>
                </Flex>

                <Flex justify="space-between">
                  <Text color="gray.600">Price impact:</Text>
                  <Text>
                    {normalizeValue(quoteData?.priceImpact ?? 0, 4).toFixed(2)}%
                  </Text>
                </Flex>

                <Flex justify="space-between">
                  <Text color="gray.600">Gas:</Text>
                  <Text>
                    {normalizeValue(+(quoteData?.gas ?? 0), 18).toFixed(2)} ETH
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
                        bg="gray.solid"
                        _hover={{ bg: "blackAlpha.solid" }}
                        onClick={() => switchChain({ chainId: base.id })}
                      >
                        Switch to Base
                      </Button>
                    ) : (
                      approveNeeded && (
                        <Button
                          flex={1}
                          loading={approve.isLoading}
                          colorPalette={"gray"}
                          onClick={approve.write}
                        >
                          Approve
                        </Button>
                      )
                    )}
                    <Button
                      flex={1}
                      variant="solid"
                      disabled={!!approve || wrongChain || !(+swapAmount > 0)}
                      colorPalette={"gray"}
                      loading={sendData.isLoading}
                      onClick={sendData.send}
                    >
                      I'm feeling lucky
                    </Button>
                  </Flex>
                )}
              </Flex>
            </Box>
          </Box>
        </VStack>
      </Center>
    </Container>
  );
};

export default LuckyDeFi;
