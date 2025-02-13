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
  Skeleton,
} from "@chakra-ui/react";
import { base } from "viem/chains";
import { useMemo, useState, ReactNode } from "react";
import { useSwitchChain, useAccount } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";
import Image from "next/image";
import { Spoiler } from "spoiled";
import {
  useApproveIfNecessary,
  useNetworkId,
  useSendEnsoTransaction,
  useTokenBalance,
} from "@/util/hooks/wallet";
import { useEnsoApprove } from "@/util/hooks/enso";
import {
  denormalizeValue,
  formatNumber,
  normalizeValue,
} from "@ensofinance/shared/util";
import {
  DEFAI_LIST,
  DEFAULT_SLIPPAGE,
  DEFI_LIST,
  MEMES_LIST,
  USDC_ADDRESSES,
} from "@/util/constants";
import { useTokenFromList } from "@/util/hooks/common";
import TokenSelector from "@/components/TokenSelector";
import WalletButton from "@/components/WalletButton";
import { Address } from "@ensofinance/shared/types";
import { Button } from "@/components/ui/button";
import { ColorModeButton } from "@/components/ui/color-mode";

enum Category {
  defi,
  meme,
  defai,
}
const CategoryTokens = {
  [Category.defi]: DEFI_LIST,
  [Category.meme]: MEMES_LIST,
  [Category.defai]: DEFAI_LIST,
};
const CategoryNames = {
  [Category.defi]: "DeFi",
  [Category.meme]: "Meme",
  [Category.defai]: "DeFAI",
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

  const swapAmount = denormalizeValue(
    swapValue.toString(),
    tokenInInfo?.decimals,
  );

  const approveData = useEnsoApprove(tokenIn, swapAmount);
  const approve = useApproveIfNecessary(
    tokenIn,
    approveData.data?.spender,
    swapAmount,
  );

  const randomToken = useMemo(() => {
    const selectedList = CategoryTokens[selectedCategory];
    const index = Math.floor(Math.random() * selectedList.length);

    return selectedList[index] as Address;
  }, [selectedCategory]);

  const {
    sendTransaction: sendData,
    isFetchingEnsoData,
    ensoData,
  } = useSendEnsoTransaction(
    swapAmount,
    randomToken,
    tokenIn,
    DEFAULT_SLIPPAGE,
  );
  const tokenOutInfo = useTokenFromList(randomToken as Address);

  const wrongChain = chainId !== base.id;
  const notEnoughBalance = tokenIn && +balance < +swapAmount;
  const needLogin = ready && !address;
  const approveNeeded = !!approve && +swapAmount > 0 && !!tokenIn;

  const valueOut = normalizeValue(
    ensoData?.amountOut.toString(),
    tokenOutInfo?.decimals,
  );
  const exchangeRate = +valueOut / +swapValue;

  const SkeletonLoader = ({
    children,
    isLoading,
  }: {
    children: ReactNode;
    isLoading: boolean;
  }) => (isLoading ? <Skeleton w={"120px"} h={"24px"} /> : <>{children}</>);

  return (
    <Container py={8} h={"full"} w={"full"}>
      <Flex justify="space-around" w={"full"}>
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_PATH}/logo_black_white.png`}
          alt={"Enso"}
          width={40}
          height={40}
        />

        <Flex gap={5} align="center">
          <ColorModeButton />
          <WalletButton />
        </Flex>
      </Flex>

      <Center h={"full"}>
        <VStack gap={4} align="flex-start">
          <Box opacity={0.7} mt={5}>
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_PATH}/wordmark_gradient.png`}
              alt="Enso"
              width={450}
              height={500}
            />
          </Box>

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
                {Object.keys(CategoryTokens).map((key) => (
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
                    <RadioCard.ItemControl
                      minW={"80px"}
                      justifyContent={"center"}
                    >
                      <RadioCard.ItemText>
                        {CategoryNames[+key as Category]}
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
                      cursor={"pointer"}
                      visibility={address ? "visible" : "hidden"}
                      _hover={{ color: "gray.600" }}
                      onClick={() =>
                        setSwapValue(
                          +normalizeValue(balance, tokenInInfo?.decimals),
                        )
                      }
                    >
                      Available:{" "}
                      {formatNumber(
                        normalizeValue(balance, tokenInInfo?.decimals),
                      )}{" "}
                      {tokenInInfo?.symbol}
                    </Text>
                  </Flex>
                  <Input
                    css={{
                      "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button":
                        {
                          WebkitAppearance: "none",
                        },
                    }}
                    type={"number"}
                    fontSize="xl"
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
                <Center
                  onClick={() => setRevealed((val) => !val)}
                  cursor={"pointer"}
                >
                  <Heading as={"h6"} size={"md"} color="gray.500">
                    You will receive:{" "}
                    <SkeletonLoader isLoading={isFetchingEnsoData}>
                      <Box>
                        <Spoiler density={0.5} hidden={!revealed}>
                          {formatNumber(valueOut)} {tokenOutInfo?.symbol}
                        </Spoiler>
                      </Box>
                    </SkeletonLoader>
                  </Heading>
                </Center>

                <Flex
                  justify="space-between"
                  onClick={() => setRevealed((val) => !val)}
                  cursor={"pointer"}
                >
                  <Text color="gray.600">Exchange Rate:</Text>
                  <SkeletonLoader isLoading={isFetchingEnsoData}>
                    <Spoiler density={0.5} hidden={!revealed}>
                      {" "}
                      <Text>
                        1 {tokenInInfo?.symbol} = {formatNumber(exchangeRate)}{" "}
                        {tokenOutInfo?.symbol}
                      </Text>
                    </Spoiler>
                  </SkeletonLoader>
                </Flex>

                <Flex justify="space-between">
                  <Text color="gray.600">Price impact:</Text>
                  <Text>
                    -{((ensoData?.priceImpact ?? 0) / 100).toFixed(2)}%
                  </Text>
                </Flex>

                {/*<Flex justify="space-between">*/}
                {/*  <Text color="gray.600">Gas:</Text>*/}
                {/*  <Text>*/}
                {/*    {formatNumber(*/}
                {/*      normalizeValue(quoteData?.gas ?? "0", 18),*/}
                {/*      true,*/}
                {/*    )}{" "}*/}
                {/*    ETH*/}
                {/*  </Text>*/}
                {/*</Flex>*/}
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
