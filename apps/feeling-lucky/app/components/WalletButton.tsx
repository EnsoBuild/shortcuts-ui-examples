import { useAccount, useDisconnect } from "wagmi";
import { Button } from "@chakra-ui/react";
import { shortenAddress } from "@enso/shared/util";
import { usePrivy } from "@privy-io/react-auth";


// TODO: adopt for AA
const WalletButton = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { connectWallet } = usePrivy();

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
