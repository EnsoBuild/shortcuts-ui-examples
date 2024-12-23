import { useAccount, useDisconnect } from "wagmi";
import { Box, Button } from "@chakra-ui/react";
import { usePrivy } from "@privy-io/react-auth";
import { UserPill } from "@privy-io/react-auth/ui";
import { shortenAddress } from "@ensofinance/shared/util";
import { isEoaMode } from "@/app/util";

const WalletButton = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { connectWallet } = usePrivy();

  if (!isEoaMode) {
    return <Box w={"150px"}><UserPill action={{ type: "login" }} /></Box>
  }

  if (address) {
    return (
      <Button w={"150px"} variant={"outline"} onClick={() => disconnect()}>
        {shortenAddress(address)}
      </Button>
    );
  }

  return (
    <Button w={"150px"} variant={"solid"} onClick={() => connectWallet()}>
      Connect Wallet
    </Button>
  );
};

export default WalletButton;
