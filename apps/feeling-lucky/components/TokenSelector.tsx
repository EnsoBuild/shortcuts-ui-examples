import Image from "next/image";
import { createListCollection, Flex, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { Address } from "viem";
import { Token, useOneInchTokenList } from "@/util/hooks/common";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";

const TokenIndicator = ({ token }: { token: Token }) => (
  <Flex align="center">
    <Image src={token.logoURI} alt={token.symbol} width={24} height={24} />
    <Text ml={2}>{token.symbol}</Text>
  </Flex>
);

const TokenSelector = ({
  value,
  onChange,
}: {
  value: Address;
  onChange: (value: Address) => void;
}) => {
  const { data: tokenMap } = useOneInchTokenList();
  const tokenList = useMemo(
    () =>
      createListCollection({
        items: tokenMap ? Object.values(tokenMap) : [],
        itemToValue: (item) => item.address,
        itemToString: (item) => item.symbol,
      }),
    [tokenMap],
  );

  return (
    <SelectRoot
      collection={tokenList}
      value={[value]}
      onValueChange={({ value }) => onChange(value[0] as Address)}
      size="sm"
      minWidth="150px"
    >
      <SelectTrigger>
        <SelectValueText placeholder="Select token">
          {(tokens: Token[]) => <TokenIndicator token={tokens[0]} />}
        </SelectValueText>
      </SelectTrigger>

      <SelectContent>
        {tokenList.items.map((token) => (
          <SelectItem item={token} key={token.address}>
            <TokenIndicator token={token} />
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
};

export default TokenSelector;
