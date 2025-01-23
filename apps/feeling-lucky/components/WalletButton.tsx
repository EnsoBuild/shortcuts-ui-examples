import { useAccount, useDisconnect } from "wagmi";
import { Button } from "@chakra-ui/react";
import { usePrivy } from "@privy-io/react-auth";
import { shortenAddress } from "@ensofinance/shared/util";

const WalletButton = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { connectWallet } = usePrivy();

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
