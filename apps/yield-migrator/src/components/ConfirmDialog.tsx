import {Box, Button, Heading, HStack, Text, VStack} from "@chakra-ui/react";
import {TrendingDown, TrendingUp} from "lucide-react";
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle
} from "@/components/ui/dialog.tsx";

const ConfirmDialog = ({ open, onOpenChange, sourcePool, targetPool }) => {
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

export default ConfirmDialog;