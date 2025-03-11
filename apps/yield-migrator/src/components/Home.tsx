import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowRightLeft,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  Box,
  Heading,
  Text,
  HStack,
  useDisclosure,
  Card,
  Center,
  Skeleton,
  Flex,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Address, isAddress } from "viem";
import { useAccount, useChainId } from "wagmi";
import { TokenData } from "@ensofinance/sdk";
import { useEnsoBalances, useEnsoTokenDetails } from "@/service/enso";
import { formatNumber, formatUSD, normalizeValue } from "@/service";
import { MOCK_POSITIONS } from "@/service/constants";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Toaster } from "@/components/ui/toaster";
import { Position } from "@/types";

const SourcePoolItem = ({
  position,
  isSelected,
  onClick,
}: {
  position: Position;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const normalizedBalance = normalizeValue(
    position.balance.amount,
    position.token.decimals,
  );

  return (
    <Box
      p={{ base: 3, md: 4 }}
      shadow="sm"
      rounded="xl"
      cursor="pointer"
      transition="all"
      _hover={{ shadow: "md" }}
      border={"2px solid"}
      borderColor={isSelected ? "blue.500" : "transparent"}
      onClick={onClick}
      width="100%"
    >
      <HStack
        justify="space-between"
        align="start"
        flexWrap={{ base: "wrap", sm: "nowrap" }}
      >
        <Box flex="1" minW={{ base: "60%", sm: "auto" }}>
          <Text fontSize={{ base: "sm", md: "md" }} fontWeight="medium">
            {position.token.name}
          </Text>

          <Text fontSize="xs" color={"gray.600"}>
            {position.token.protocolSlug}
          </Text>

          <Text fontSize={{ base: "xs", md: "sm" }}>
            {position.token.underlyingTokens
              .map(({ symbol }) => symbol)
              .join("/")}
          </Text>

          {position.token.tvl > 0 && (
            <Text mt={1} fontSize="xs" color="gray.600">
              TVL: ${formatNumber(position.token.tvl)}
            </Text>
          )}
        </Box>

        <Box textAlign="right">
          <Text fontWeight="medium" fontSize={{ base: "sm", md: "md" }}>
            {formatUSD(+normalizedBalance * +position.balance.price)}
          </Text>

          <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">
            {formatNumber(normalizedBalance)} {position.token.symbol}
          </Text>

          {position.token.apy > 0 && (
            <Text fontSize={{ base: "sm", md: "md" }}>
              {position.token.apy.toFixed(2)}% APY
            </Text>
          )}
        </Box>
      </HStack>
    </Box>
  );
};

const TargetPoolItem = ({
  token,
  sourceApy,
  onSelect,
}: {
  token: TokenData;
  sourceApy: number;
  onSelect: () => void;
}) => {
  const apyDiff = token.apy - sourceApy;
  const isPositive = apyDiff > 0;

  return (
    <Box
      p={{ base: 3, md: 4 }}
      shadow="sm"
      rounded="xl"
      cursor="pointer"
      _hover={{ shadow: "md" }}
      onClick={onSelect}
      width="100%"
    >
      <HStack
        justify="space-between"
        align="start"
        flexWrap={{ base: "wrap", sm: "nowrap" }}
      >
        <Box flex="1" minW={{ base: "60%", sm: "auto" }}>
          <Text fontSize={{ base: "sm", md: "md" }} fontWeight="medium">
            {token.name}
          </Text>
          <Text fontSize="xs" color={"gray.600"}>
            {token.protocolSlug}
          </Text>{" "}
          {token.tvl > 0 && (
            <Text mt={1} fontSize="xs" color="gray.600">
              TVL: ${formatUSD(token.tvl)}
            </Text>
          )}
        </Box>

        {token.apy > 0 && (
          <Box textAlign="right">
            <Text fontSize={{ base: "md", md: "lg" }} fontWeight="medium">
              {token.apy.toFixed(2)}% APY
            </Text>
            <HStack
              justify="end"
              gap={1}
              fontSize={{ base: "xs", md: "sm" }}
              color={isPositive ? "green.500" : "red.500"}
            >
              {isPositive ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              {sourceApy > 0 && token.apy > 0 && (
                <Text color={isPositive ? "green.600" : "red.600"}>
                  {isPositive ? "+" : ""}
                  {apyDiff.toFixed(2)}% vs source
                </Text>
              )}
            </HStack>
          </Box>
        )}
      </HStack>
    </Box>
  );
};

const RenderSkeletons = () => {
  const skeletonWidth = useBreakpointValue({ base: "100%", md: "340px" });

  return [1, 2, 3].map((_, i) => (
    <Skeleton rounded="xl" key={i} h={"110px"} w={skeletonWidth} />
  ));
};

const usePositions = () => {
  const { data: balances, isLoading: balancesLoading } = useEnsoBalances();
  const sortedBalances = balances
    ?.slice()
    .sort(
      (a, b) =>
        +normalizeValue(+b.amount, b.decimals) * +b.price -
        +normalizeValue(+a.amount, a.decimals) * +a.price,
    );
  const notEmptyBalanceAddresses = sortedBalances
    ?.filter(({ price, token }) => +price > 0 && isAddress(token))
    .map((position) => position.token);

  const { data: positionsTokens, isLoading: tokenLoading } =
    useEnsoTokenDetails({
      address: notEmptyBalanceAddresses,
      type: "defi",
    });

  const positions = sortedBalances
    ?.map((balance) => {
      const token = positionsTokens?.find(
        (token) => token.address === balance.token,
      );

      return { balance, token };
    })
    .filter(({ token }) => token);

  const positionsLoading = balancesLoading || tokenLoading;

  return {
    positions,
    positionsLoading,
  };
};

const useTargetTokens = (
  underlyingTokensExact: Address[],
  currentTokenName: string,
  chainId?: number,
) => {
  const { data: underlyingTokensData, isLoading: targetLoading } =
    useEnsoTokenDetails({
      underlyingTokensExact,
      chainId,
    });

  const filteredUnderlyingTokens = underlyingTokensData
    ?.filter((token) => token.name !== currentTokenName && token.apy > 0)
    .sort((a, b) => b.apy - a.apy);

  return { filteredUnderlyingTokens, targetLoading };
};

const Home = () => {
  const [selectedSource, setSelectedSource] = useState<Position>();
  const [selectedTarget, setSelectedTarget] = useState<TokenData>();
  const [isDemo, setIsDemo] = useState(false);
  const { open, onOpen, onClose } = useDisclosure();
  const { address } = useAccount();
  const chainId = useChainId();

  useEffect(() => {
    setSelectedSource(undefined);
  }, [chainId, address, isDemo]);

  const underlyingTokens = selectedSource?.token.underlyingTokens.map(
    ({ address }) => address,
  );

  const { positions, positionsLoading } = usePositions();

  const { filteredUnderlyingTokens, targetLoading } = useTargetTokens(
    underlyingTokens,
    selectedSource?.token.name,
    isDemo ? 8453 : chainId,
  );

  const positionsToUse = isDemo ? MOCK_POSITIONS : positions;

  const handleTargetSelect = (target) => {
    setSelectedTarget(target);
    onOpen();
  };

  // Determine if we're on mobile
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box minH="100vh">
      <Toaster />

      <Center>
        <Box
          mx="auto"
          w="full"
          maxW="7xl"
          px={{ base: 2, md: 4 }}
          py={{ base: 4, md: 8 }}
        >
          <Flex
            align="center"
            justifyContent="space-around"
            direction={{ base: "column", sm: "row" }}
            gap={{ base: 3, md: 5 }}
            mb={{ base: 3, md: 5 }}
            w="full"
          >
            <Box>
              <Heading
                display="flex"
                alignItems="center"
                gap={2}
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="bold"
              >
                <ArrowRightLeft className="h-6 w-6" />
                Yield Migrator
              </Heading>
            </Box>

            <Box
              p={{ base: 2, md: 4 }}
              shadow="sm"
              rounded="xl"
              cursor="pointer"
              border={"2px solid"}
              fontWeight={"medium"}
              borderColor={isDemo ? "blue.500" : "transparent"}
              onClick={() => setIsDemo((val) => !val)}
            >
              Use demo positions
            </Box>
          </Flex>

          <Flex
            justifyContent="center"
            direction={{ base: "column", md: "row" }}
            gap={{ base: 4, md: 6 }}
            w="full"
            align="start"
          >
            {/* Source Pool Column */}
            <Box w={{ base: "full", md: "390px" }} mb={{ base: 4, md: 0 }}>
              <Card.Root>
                <Card.Header>
                  <Heading size="md">Your positions</Heading>
                </Card.Header>

                <Card.Body gap={4}>
                  {positionsLoading ? (
                    <RenderSkeletons />
                  ) : positionsToUse?.length > 0 ? (
                    positionsToUse.map((position) => (
                      <SourcePoolItem
                        key={position.token.address}
                        position={position}
                        isSelected={
                          selectedSource?.token.address ===
                          position.token.address
                        }
                        onClick={() => setSelectedSource(position)}
                      />
                    ))
                  ) : (
                    <Box
                      display="flex"
                      h="40"
                      alignItems="center"
                      justifyContent="center"
                      color="gray.500"
                    >
                      {address ? (
                        <Text>No positions found</Text>
                      ) : (
                        <Text textAlign="center" px={2}>
                          Connect your wallet or use demo to continue
                        </Text>
                      )}
                    </Box>
                  )}
                </Card.Body>
              </Card.Root>
            </Box>

            {/* Mobile arrow indicator */}
            {isMobile && selectedSource && (
              <Flex justify="center" w="full" py={2}>
                <ArrowRight className="h-6 w-6" />
              </Flex>
            )}

            {/* Target Pool Column */}
            <Box w={{ base: "full", md: "390px" }}>
              <Card.Root>
                <Card.Header>
                  <Heading size="md">Target Pool</Heading>
                </Card.Header>

                <Card.Body gap={4}>
                  {selectedSource ? (
                    targetLoading ? (
                      <RenderSkeletons />
                    ) : (
                      filteredUnderlyingTokens?.map((target) => (
                        <TargetPoolItem
                          key={target.address}
                          token={target}
                          sourceApy={selectedSource?.token.apy}
                          onSelect={() => handleTargetSelect(target)}
                        />
                      ))
                    )
                  ) : (
                    <Box
                      display="flex"
                      h="40"
                      alignItems="center"
                      justifyContent="center"
                      color="gray.500"
                    >
                      <HStack alignItems="center" gap={2}>
                        <Text>Select a source pool</Text>
                        <ArrowRight className="h-4 w-4" />
                      </HStack>
                    </Box>
                  )}
                </Card.Body>
              </Card.Root>
            </Box>
          </Flex>
        </Box>
      </Center>

      <ConfirmDialog
        open={open}
        onOpenChange={onClose}
        position={selectedSource}
        targetToken={selectedTarget}
        isDemo={isDemo}
      />
    </Box>
  );
};

export default Home;
