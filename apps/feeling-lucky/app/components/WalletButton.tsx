import { useAccount, useDisconnect } from "wagmi";
import { Button } from "@chakra-ui/react";
import { shortenAddress } from "@enso/shared/util";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { UserPill } from "@privy-io/react-auth/ui";
import { isEoaMode } from "../util";

const WalletButton = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { connectWallet } = usePrivy();
  const { wallets } = useWallets();

  const isEoaEnabled = isEoaMode();

  console.log("wallets", wallets);

  if (isEoaEnabled) {
    return <UserPill action={{ type: "login" }} />;
  }

  if (address) {
    return (
      <Button variant={"outline"} onClick={() => disconnect()}>
        {shortenAddress(address)}
      </Button>
    );
  }

  return (
    <Button variant={"solid"} onClick={() => connectWallet()}>
      Connect Wallet
    </Button>
  );
};

export default WalletButton;
