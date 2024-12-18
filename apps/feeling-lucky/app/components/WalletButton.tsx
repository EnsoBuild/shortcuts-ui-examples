import { useAccount, useDisconnect } from "wagmi";
import { Box, Button } from "@chakra-ui/react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { UserPill } from "@privy-io/react-auth/ui";
import { shortenAddress } from "@enso/shared/util";
import { isEoaMode } from "../util";

const WalletButton = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { connectWallet } = usePrivy();
  const { wallets } = useWallets();

  const isEoaEnabled = isEoaMode();

  console.log("wallets", wallets);

  if (isEoaEnabled) {
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
