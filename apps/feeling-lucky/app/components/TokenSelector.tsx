import Image from "next/image";
import { Flex, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { Select } from "chakra-react-select";
import { useOneInchTokenList } from "../hooks/common";
import { Address } from "@enso/shared/types";

const TokenSelector = ({
  value,
  onChange,
}: {
  value: Address;
  onChange: (value: Address) => void;
}) => {
  const { data: tokenMap } = useOneInchTokenList();
  const token = tokenMap?.[value];
  const tokenList = useMemo(
    () => (tokenMap ? Object.values(tokenMap) : []),
    [tokenMap],
  );

  const placeHolderStyles = value
    ? {}
    : { backgroundColor: "gray.700", color: "white" };

  return (
    <Select
      chakraStyles={{
        container: (provided) => ({
          ...provided,
          minWidth: "150px",
        }),
        control: (provided) => ({
          ...provided,
          ...placeHolderStyles,
        }),
        placeholder: (provided) => ({
          ...provided,
          color: "white",
          whiteSpace: "nowrap",
        }),
      }}
      value={token}
      options={tokenList}
      onChange={(token) => onChange(token?.address)}
      getOptionLabel={(token) => token.symbol}
      getOptionValue={(token) => token.address}
      isSearchable
      isClearable={false}
      placeholder="Select token"
      formatOptionLabel={(token) => (
        <Flex align="center">
          <Image
            src={token.logoURI}
            alt={token.symbol}
            width={24}
            height={24}
          />
          <Text ml={2}>{token.symbol}</Text>
        </Flex>
      )}
    />
  );
};

export default TokenSelector;
