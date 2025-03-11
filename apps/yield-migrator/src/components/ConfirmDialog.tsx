import {
  Box,
  Flex,
  Grid,
  Heading,
  HStack,
  Spinner,
  Text,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { TokenData } from "@ensofinance/sdk";
import { useEnsoData } from "@/service/enso";
import { useApproveIfNecessary } from "@/service/wallet";
import { capitalize } from "@/service/common";
import { normalizeValue } from "@/service";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Position } from "@/types";

const ConfirmDialog = ({
  open,
  onOpenChange,
  position,
  targetToken,
  isDemo,
}: {
  targetToken?: TokenData;
  position?: Position;
  open: boolean;
  onOpenChange: (open: any) => void;
  isDemo?: boolean;
}) => {
  const bothApyExist = position?.token?.apy && targetToken?.apy;
  const sourceApy = position?.token?.apy;
  const apyDifference = (targetToken?.apy - sourceApy).toFixed(1);
  const apyPercentageGain = (
    ((targetToken?.apy - sourceApy) / sourceApy) *
    100
  ).toFixed(2);

  const { routeData, sendTransaction, routeLoading } = useEnsoData({
    amountIn: position?.balance.amount,
    tokenIn: position?.token.address,
    tokenOut: targetToken?.address,
    chainId: position?.token.chainId,
    active: open,
  });

  const approve = useApproveIfNecessary(
    position?.token.address,
    position?.balance.amount
  );

  const approveNeeded =
    !!approve && +position?.balance.amount > 0 && !!position?.token.address;

  // Determine if we're on mobile
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Preview Migration</DialogTitle>
          <DialogDescription>
            Review your position migration details
          </DialogDescription>
        </DialogHeader>

        <Box mx={{ base: 2, md: 10 }} my={{ base: 4, md: 10 }}>
          <VStack gap={4} align="start" width="100%">
            <Box width="100%">
              <Heading size="sm">Source Position</Heading>

              <HStack justify="space-between" mt={1} width="100%">
                <Text fontSize={{ base: "sm", md: "md" }}>
                  {position?.token?.name}
                </Text>
                <Text fontSize={{ base: "sm", md: "md" }}>
                  {position?.token?.apy?.toFixed(2)}% APY
                </Text>
              </HStack>

              <HStack color={"gray.500"} fontSize={{ base: "xs", md: "sm" }}>
                <Text>{position?.token?.symbol}</Text>
                <Text>{capitalize(position?.token?.protocolSlug ?? "")}</Text>
              </HStack>
            </Box>

            <Box width="100%">
              <Heading size="sm">Target Position</Heading>

              <HStack justify="space-between" mt={1} width="100%">
                <Text fontSize={{ base: "sm", md: "md" }}>
                  {targetToken?.name}
                </Text>
                <Text fontSize={{ base: "sm", md: "md" }}>
                  {targetToken?.apy?.toFixed(2)}% APY
                </Text>
              </HStack>

              <HStack color={"gray.500"} fontSize={{ base: "xs", md: "sm" }}>
                <Text>{targetToken?.symbol}</Text>
                <Text>{capitalize(targetToken?.protocolSlug ?? "")}</Text>
              </HStack>
            </Box>

            {bothApyExist && (
              <Box width="100%">
                <Heading size="sm">Expected Improvement</Heading>

                <HStack mt={2} align="center" gap={2}>
                  <Text
                    fontSize={{ base: "xl", md: "2xl" }}
                    fontWeight="semibold"
                  >
                    {apyDifference}%
                  </Text>

                  <Text color={+apyDifference > 0 ? "green.600" : "red.600"}>
                    {+apyDifference > 0 ? (
                      <TrendingUp className="h-5 w-5" />
                    ) : (
                      <TrendingDown className="h-5 w-5" />
                    )}
                  </Text>
                </HStack>
                {/*<Text fontSize="sm" color="gray.600">*/}
                {/*  {apyPercentageGain}% improvement in APY*/}
                {/*</Text>*/}
              </Box>
            )}

            {routeLoading ? (
              <Spinner />
            ) : (
              <Grid
                templateColumns={{ base: "1fr", md: "1fr 2.5fr" }}
                gap={{ base: 0, md: 1 }}
                width="100%"
                my={{ base: 2, md: 4 }}
              >
                <Text fontWeight={"bold"} fontSize={{ base: "sm", md: "md" }}>
                  You will receive:
                </Text>
                <Text fontSize={{ base: "sm", md: "md" }}>
                  {normalizeValue(
                    routeData?.amountOut.toString(),
                    targetToken?.decimals
                  )}{" "}
                  {targetToken?.symbol}
                </Text>

                <Text
                  fontWeight={"bold"}
                  fontSize={{ base: "sm", md: "md" }}
                  mt={{ base: 2, md: 0 }}
                >
                  Price impact:
                </Text>
                <Text fontSize={{ base: "sm", md: "md" }}>
                  -{(routeData?.priceImpact / 100).toFixed(2)}%
                </Text>
              </Grid>
            )}

            {/*<Text fontSize="sm" color="gray.600">*/}
            {/*  Estimated gas cost: ~$20-30*/}
            {/*</Text>*/}
          </VStack>
        </Box>

        <DialogFooter>
          <Flex
            justify="space-between"
            w={"full"}
            direction={{ base: isMobile && approveNeeded ? "column" : "row" }}
            gap={{ base: 2, md: 0 }}
          >
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            {isDemo || (
              <Flex
                gap={{ base: 2, md: 4 }}
                width={{ base: isMobile && approveNeeded ? "100%" : "auto" }}
                direction={{
                  base: isMobile && approveNeeded ? "column" : "row",
                }}
              >
                {approveNeeded && (
                  <Button
                    loading={approve.isLoading}
                    onClick={approve.write}
                    colorScheme="primary"
                    width={{ base: isMobile ? "100%" : "auto" }}
                  >
                    Approve
                  </Button>
                )}

                <Button
                  disabled={!!approve || !routeData?.tx}
                  loading={sendTransaction.isLoading}
                  onClick={sendTransaction.send}
                  colorScheme="primary"
                  width={{ base: isMobile ? "100%" : "auto" }}
                >
                  Confirm Migration
                </Button>
              </Flex>
            )}
          </Flex>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default ConfirmDialog;
