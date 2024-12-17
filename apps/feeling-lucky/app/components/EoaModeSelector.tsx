import { FormControl, FormLabel, Switch } from "@chakra-ui/react";
import { isEoaMode, toggleIsEoaMode } from "../util";

const EoaModeSelector = () => (
  <FormControl
    color={"gray.500"}
    display="flex"
    gap={2}
    width={"fit-content"}
    alignItems={"center"}
  >
    <FormLabel htmlFor="wallet-switch" m={0}>
      Wallet
    </FormLabel>
    <Switch
      id="wallet-switch"
      isChecked={isEoaMode()}
      onChange={toggleIsEoaMode}
    />
    <FormLabel htmlFor="wallet-switch" m={0}>
      EOA
    </FormLabel>
  </FormControl>
);

export default EoaModeSelector;
