"use client"

import { ChakraProvider } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import {chakraTheme} from "@/app/config";

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={chakraTheme}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
