import { extendTheme } from "@chakra-ui/react";
import { createConfig } from "@privy-io/wagmi";
import { base } from "viem/chains";
import { http } from "viem";

export const chakraTheme = extendTheme({
  components: {
    Badge: {
      baseStyle: {
        borderRadius: "full",
      },
    },
    Button: {
      variants: {
        solid: {
          bg: "gray.700",
          color: "white",
          _hover: {
            bg: "brand.600",
          },
          _disabled: {
            bg: "gray.200",
            color: "gray.400",
          },
        },
        outline: {
          borderColor: "gray.200",
          _hover: {
            bg: "gray.50",
          },
        },
      },
    },
  },
});

export const wagmiConfig = createConfig({
  chains: [base], // Pass your required chains as an array
  transports: {
    // TODO: check if required
    [base.id]: http(),
  },
});
