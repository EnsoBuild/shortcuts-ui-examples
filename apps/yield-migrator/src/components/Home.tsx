import React, { useState } from "react";
import {
  ArrowRight,
  ArrowRightLeft,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  useDisclosure,
  Card,
} from "@chakra-ui/react";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";

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
    bg="white"
    shadow="sm"
    rounded="xl"
    cursor="pointer"
    transition="all"
    _hover={{ shadow: "md" }}
    border={isSelected ? "2px solid" : "none"}
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
      bg="white"
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

const PreviewDialog = ({ open, onOpenChange, sourcePool, targetPool }) => {
  const apy = {
    difference: (targetPool?.apy - sourcePool?.apy).toFixed(1),
    percentageGain: (
      ((targetPool?.apy - sourcePool?.apy) / sourcePool?.apy) *
      100
    ).toFixed(1),
  };

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Preview Migration</DialogTitle>
          <DialogDescription>
            Review your position migration details
          </DialogDescription>
        </DialogHeader>

        <VStack gap={4}>
          <Box>
            <Heading size="sm">Source Position</Heading>
            <HStack justify="space-between" mt={1}>
              <Text>{sourcePool?.protocol}</Text>
              <Text>{sourcePool?.apy}% APY</Text>
            </HStack>
          </Box>

          <Box>
            <Heading size="sm">Target Position</Heading>
            <HStack justify="space-between" mt={1}>
              <Text>{targetPool?.protocol}</Text>
              <Text>{targetPool?.apy}% APY</Text>
            </HStack>
          </Box>

          <Box>
            <Heading size="sm">Expected Improvement</Heading>
            <HStack mt={2} align="center" gap={2}>
              <Text fontSize="2xl" fontWeight="semibold">
                {apy.difference}%
              </Text>
              <Text color={+apy.difference > 0 ? "green.600" : "red.600"}>
                {+apy.difference > 0 ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )}
              </Text>
            </HStack>
            <Text fontSize="sm" color="gray.600">
              {apy.percentageGain}% improvement in APY
            </Text>
          </Box>

          <Text fontSize="sm" color="gray.600">
            Estimated gas cost: ~$20-30
          </Text>
        </VStack>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button>Confirm Migration</Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

const Home = () => {
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const { open, onOpen, onClose } = useDisclosure();

  const handleTargetSelect = (target) => {
    setSelectedTarget(target);
    onOpen();
  };

  return (
    <Box minH="100vh" bg="gray.50">
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

        <HStack gap={6}>
          {/* Source Pool Column */}
          <Box w="50%">
            <Card.Root>
              <Card.Header>
                <Heading size="md">Source Pool</Heading>
              </Card.Header>
              <Card.Body>
                {sourcePools.map((pool) => (
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
          <Box w="50%">
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

        <PreviewDialog
          open={open}
          onOpenChange={onClose}
          sourcePool={selectedSource}
          targetPool={selectedTarget}
        />
      </Box>
    </Box>
  );
};

export default Home;
