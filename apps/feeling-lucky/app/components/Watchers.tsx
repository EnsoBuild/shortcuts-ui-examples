import { useSetValidWagmiAddress } from "../hooks/wallet";

const Watchers = ({ children }) => {
  useSetValidWagmiAddress();

  return <>{children}</>;
};

export default Watchers;