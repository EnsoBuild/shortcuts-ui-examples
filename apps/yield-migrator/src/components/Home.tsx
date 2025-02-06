import { useState } from "react";
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
} from "@chakra-ui/react";
import ConfirmDialog from "@/components/ConfirmDialog.tsx";
import {
  useEnsoBalances,
  useEnsoToken,
  useEnsoTokenDetails,
} from "@/service/enso.tsx";
import { isAddress } from "viem";

// Mock data for available source pools
const sourcePools = [
  {
    id: 1,
    protocol: "Aave",
    asset: "USDC",
    amount: "10000",
    apy: 4.2,
    tvl: 1200000000,
  },
  {
    id: 2,
    protocol: "Compound",
    asset: "ETH",
    amount: "5",
    apy: 3.8,
    tvl: 800000000,
  },
  {
    id: 3,
    protocol: "Maker",
    asset: "DAI",
    amount: "15000",
    apy: 3.5,
    tvl: 1500000000,
  },
];

const targetPools = {
  USDC: [
    { protocol: "Compound", apy: 4.5, tvl: 900000000 },
    { protocol: "Curve", apy: 4.8, tvl: 600000000 },
    { protocol: "Yearn", apy: 5.1, tvl: 400000000 },
  ],
  ETH: [
    { protocol: "Aave", apy: 4.0, tvl: 1100000000 },
    { protocol: "Lido", apy: 4.2, tvl: 2000000000 },
    { protocol: "Rocket Pool", apy: 4.1, tvl: 500000000 },
  ],
  DAI: [
    { protocol: "Aave", apy: 3.8, tvl: 800000000 },
    { protocol: "Compound", apy: 3.9, tvl: 700000000 },
    { protocol: "Curve", apy: 4.0, tvl: 900000000 },
  ],
};

const SourcePoolItem = ({ pool, isSelected, onClick }) => (
  <Box
    mb={4}
    p={4}
    shadow="sm"
    rounded="xl"
    cursor="pointer"
    transition="all"
    _hover={{ shadow: "md" }}
    border={"2px solid"}
    borderColor={isSelected ? "blue.500" : "transparent"}
    onClick={onClick}
  >
    <HStack justify="space-between" align="start">
      <Box>
        <Heading size="md">{pool.protocol}</Heading>
        <Text color="gray.600">{pool.asset}</Text>
        <Text mt={1} fontSize="sm" color="gray.600">
          TVL: ${(pool.tvl / 1000000).toFixed(1)}M
        </Text>
      </Box>
      <Box textAlign="right">
        <Text fontSize="lg" fontWeight="medium">
          {pool.amount} {pool.asset}
        </Text>
        <Text fontSize="sm" color="gray.600">
          {pool.apy}% APY
        </Text>
      </Box>
    </HStack>
  </Box>
);

const TargetPoolItem = ({ pool, sourceApy, onSelect }) => {
  const apyDiff = pool.apy - sourceApy;
  const isPositive = apyDiff > 0;

  return (
    <Box
      mb={4}
      p={4}
      shadow="sm"
      rounded="xl"
      cursor="pointer"
      _hover={{ shadow: "md" }}
      onClick={onSelect}
    >
      <HStack justify="space-between" align="start">
        <Box>
          <Heading size="md">{pool.protocol}</Heading>
          <Text mt={1} fontSize="sm" color="gray.600">
            TVL: ${(pool.tvl / 1000000).toFixed(1)}M
          </Text>
        </Box>
        <Box textAlign="right">
          <Text fontSize="lg" fontWeight="medium">
            {pool.apy}% APY
          </Text>
          <HStack justify="end" gap={1} fontSize="sm">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <Text color={isPositive ? "green.600" : "red.600"}>
              {isPositive ? "+" : ""}
              {apyDiff.toFixed(1)}% vs source
            </Text>
          </HStack>
        </Box>
      </HStack>
    </Box>
  );
};

const usePositions = () => {
  const { data: balances } = useEnsoBalances();
  const positionsTokens = useEnsoTokenDetails(
    balances
      ?.filter(({ price, token }) => +price > 0 && isAddress(token))
      .map((position) => position.token),
  );
  console.log(positionsTokens);
  return balances
    ?.map((position) => {
      const token = positionsTokens?.find(
        (token) => token.address === position.token,
      );

      return { position, token };
    })
    .filter(({ token, position }) => token?.type === "defi");
};

const Home = () => {
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const { open, onOpen, onClose } = useDisclosure();

  const positions = usePositions();

  const sourcePools = positions?.map(({ position, token }) => ({
    id: position.token,
    protocol: token.protocolSlug,
    asset: token.symbol,
    amount: position.amount,
    apy: token.apy,
    tvl: "100000"
  }));

  console.log(positions);

  const handleTargetSelect = (target) => {
    setSelectedTarget(target);
    onOpen();
  };

  return (
    <Box minH="100vh">
      <Center>
        <Box mx="auto" maxW="7xl" px={4} py={8}>
          <Heading
            mb={8}
            display="flex"
            alignItems="center"
            gap={2}
            fontSize="2xl"
            fontWeight="bold"
          >
            <ArrowRightLeft className="h-6 w-6" />
            Yield Migrator
          </Heading>

          <HStack gap={6} w={"full"} align="start">
            {/* Source Pool Column */}
            <Box w={300}>
              <Card.Root>
                <Card.Header>
                  <Heading size="md">Your positions</Heading>
                </Card.Header>
                <Card.Body>
                  {sourcePools?.map((pool) => (
                    <SourcePoolItem
                      key={pool.id}
                      pool={pool}
                      isSelected={selectedSource?.id === pool.id}
                      onClick={() => setSelectedSource(pool)}
                    />
                  ))}
                </Card.Body>
              </Card.Root>
            </Box>

            {/* Target Pool Column */}
            <Box w={300}>
              <Card.Root>
                <Card.Header>
                  <Heading size="md">Target Pool</Heading>
                </Card.Header>
                <Card.Body>
                  {selectedSource ? (
                    targetPools[selectedSource.asset]
                      .filter(
                        (target) => target.protocol !== selectedSource.protocol,
                      )
                      .map((target, index) => (
                        <TargetPoolItem
                          key={index}
                          pool={target}
                          sourceApy={selectedSource.apy}
                          onSelect={() => handleTargetSelect(target)}
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
                      <HStack alignItems="center" gap={2}>
                        <Text>Select a source pool</Text>
                        <ArrowRight className="h-4 w-4" />
                      </HStack>
                    </Box>
                  )}
                </Card.Body>
              </Card.Root>
            </Box>
          </HStack>
        </Box>
      </Center>
      <ConfirmDialog
        open={open}
        onOpenChange={onClose}
        sourcePool={selectedSource}
        targetPool={selectedTarget}
      />
    </Box>
  );
};

export default Home;
