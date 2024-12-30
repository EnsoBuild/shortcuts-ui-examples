import { createSystem, defaultConfig } from "@chakra-ui/react";
import { createConfig } from "@privy-io/wagmi";
import { base } from "viem/chains";
import { http } from "viem";

export const chakraTheme = createSystem(defaultConfig, {});

export const wagmiConfig = createConfig({
  chains: [base], // Pass your required chains as an array
  transports: {
    // TODO: check if required
    [base.id]: http(),
  },
});
