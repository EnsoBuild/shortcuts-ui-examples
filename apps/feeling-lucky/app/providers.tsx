"use client";

import { useRef } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { PrivyClientConfig, PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "@privy-io/wagmi";
import { SnackbarProvider } from "notistack";
import { chakraTheme, wagmiConfig } from "./config";
import { isEoaMode } from "./util";
import Watchers from "./components/Watchers";

const queryClient = new QueryClient();
const PRIVY_KEY = process.env.NEXT_PUBLIC_PRIVY_KEY;

export function Providers({ children }) {
  // has to be set up in component to get access to client's localStorage
  const { current: privyConfig } = useRef<PrivyClientConfig>({
    appearance: {
      theme: "light",
      accentColor: "#EDF2F7",
      logo: "/public/enso.svg",
      walletChainType: "ethereum-only",
    },
    loginMethods: ["wallet", "telegram", "google"],
    embeddedWallets: isEoaMode() ? { createOnLogin: "all-users" } : undefined,
  });

  return (
    <PrivyProvider appId={PRIVY_KEY} config={privyConfig}>
      <SnackbarProvider>
        <QueryClientProvider client={queryClient}>
          <WagmiProvider config={wagmiConfig}>
            <ChakraProvider theme={chakraTheme}>
              <Watchers>{children}</Watchers>
            </ChakraProvider>
          </WagmiProvider>
        </QueryClientProvider>
      </SnackbarProvider>
    </PrivyProvider>
  );
}
