import { Box, Flex, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { TokenData } from "@ensofinance/sdk";
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
import { useEnsoData } from "@/service/enso";
import { useApproveIfNecessary } from "@/service/wallet";

const ConfirmDialog = ({
  open,
  onOpenChange,
  position,
  targetToken,
}: {
  targetToken?: TokenData;
  position?: Position;
  open: boolean;
  onOpenChange: (open: any) => void;
}) => {
  const bothApyExist = position?.token?.apy && targetToken?.apy;
  const sourceApy = position?.token?.apy;
  const apyDifference = (targetToken?.apy - sourceApy).toFixed(1);
  const apyPercentageGain = (
    ((targetToken?.apy - sourceApy) / sourceApy) *
    100
  ).toFixed(1);

  const routeData = useEnsoData(
    position?.balance.amount,
    position?.token.address,
    targetToken?.address,
  );

  const approve = useApproveIfNecessary(
    position?.token.address,
    position?.balance.amount,
  );

  const approveNeeded =
    !!approve && +position?.balance.amount > 0 && !!position?.token.address;

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
              <Text>{position?.token?.name}</Text>
              <Text>{position?.token?.apy}% APY</Text>
            </HStack>
          </Box>

          <Box>
            <Heading size="sm">Target Position</Heading>
            <HStack justify="space-between" mt={1}>
              <Text>{targetToken?.name}</Text>
              <Text>{targetToken?.apy}% APY</Text>
            </HStack>
          </Box>

          {bothApyExist && (
            <Box>
              <Heading size="sm">Expected Improvement</Heading>
              <HStack mt={2} align="center" gap={2}>
                <Text fontSize="2xl" fontWeight="semibold">
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

          {/*<Text fontSize="sm" color="gray.600">*/}
          {/*  Estimated gas cost: ~$20-30*/}
          {/*</Text>*/}
        </VStack>

        <DialogFooter>
          <Flex justify="space-between" w={"full"}>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            <Flex gap={4}>
              {approveNeeded && (
                <Button
                  loading={approve.isLoading}
                  onClick={approve.write}
                  colorScheme="primary"
                >
                  Approve
                </Button>
              )}
              <Button
                disabled={!!approve || !routeData.routerData?.tx}
                loading={routeData.sendTransaction.isLoading}
                onClick={routeData.sendTransaction.send}
                colorScheme="primary"
              >
                Confirm Migration
              </Button>
            </Flex>
          </Flex>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default ConfirmDialog;
