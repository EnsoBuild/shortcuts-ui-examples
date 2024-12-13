"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "@privy-io/wagmi";
import { SnackbarProvider } from "notistack";
import { chakraTheme, wagmiConfig } from "./config";

const queryClient = new QueryClient();
const PRIVY_KEY = process.env.NEXT_PUBLIC_PRIVY_KEY;

export function Providers({ children }) {
  return (
    <PrivyProvider
      appId={PRIVY_KEY}
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          logo: "https://your-logo-url",
          walletChainType: "ethereum-only",
        },

        // Create embedded wallets for users who don't have a wallet
        // embeddedWallets: {
        //     // createOnLogin: "users-without-wallets",
        //     createOnLogin: "off",
        //     noPromptOnSignature: true,
        // },
      }}
    >
      <SnackbarProvider>
        <QueryClientProvider client={queryClient}>
          <WagmiProvider config={wagmiConfig}>
            <ChakraProvider theme={chakraTheme}>{children}</ChakraProvider>
          </WagmiProvider>
        </QueryClientProvider>
      </SnackbarProvider>
    </PrivyProvider>
  );
}
