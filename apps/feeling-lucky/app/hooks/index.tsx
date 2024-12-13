import {
  useReadContract,
  useAccount,
  useSendTransaction,
  UseSimulateContractParameters,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
  useChainId,
  UseSendTransactionReturnType,
  UseWriteContractReturnType,
} from "wagmi";
import { useCallback, useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import { useQuery } from "@tanstack/react-query";
import { BaseError } from "viem";
import erc20Abi from "../../erc20Abi.json";
import { normalizeValue } from "@enso/shared/util";
import { Address } from "@enso/shared/types";
import {useWallets} from "@privy-io/react-auth";

enum TxState {
  Success,
  Failure,
  Pending,
}

const toastState: Record<TxState, "success" | "error" | "info"> = {
  [TxState.Success]: "success",
  [TxState.Failure]: "error",
  [TxState.Pending]: "info",
};

export const useErc20Balance = (tokenAddress: `0x${string}`) => {
  const { address } = useAccount();
  const { data } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address],
  });

  return data?.toString() ?? "0";
};

export const useAllowance = (token: Address, spender: Address) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { data } = useReadContract({
    chainId,
    address: token,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address, spender],
  });

  return data?.toString() ?? "0";
};

export const useApprove = (token: Address, target: Address, amount: string) => {
  const tokenData = useTokenFromList(token);
  const chainId = useChainId();

  return {
    title: `Approve ${normalizeValue(+amount, tokenData?.decimals)} of ${tokenData?.symbol} for spending`,
    args: {
      chainId,
      address: token,
      abi: erc20Abi,
      functionName: "approve",
      args: [target, amount],
    },
  };
};

export const useExtendedContractWrite = (
  title: string,
  writeContractVariables: UseSimulateContractParameters,
) => {
  const simulateContract = useSimulateContract(writeContractVariables);
  const contractWrite = useWatchWriteTransactionHash(title);

  const write = useCallback(() => {
    if (
      writeContractVariables.address &&
      writeContractVariables.abi &&
      writeContractVariables.functionName
    ) {
      console.log("writeContractVariables", writeContractVariables);
      // @ts-ignore
      contractWrite.writeContract(writeContractVariables, {
        onError: (error: BaseError) => {
          enqueueSnackbar({
            message: error?.shortMessage || error.message,
            variant: "error",
          });
          console.error(error);
        },
      });
    }
  }, [contractWrite, writeContractVariables]);

  return {
    ...contractWrite,
    write,
    estimateError: simulateContract.error,
  };
};

const useWatchTransactionHash = <
  T extends UseSendTransactionReturnType | UseWriteContractReturnType,
>(
  description: string,
  usedWriteContract: T,
) => {
  // const addRecentTransaction = useAddRecentTransaction();

  const hash = usedWriteContract.data;

  // useEffect(() => {
  //   if (hash) addRecentTransaction({ hash, description });
  // }, [hash]);

  const waitForTransaction = useWaitForTransactionReceipt({
    hash,
  });
  const writeLoading = usedWriteContract.status === "pending";

  // toast error if tx failed to be mined and success if it is having confirmation
  useEffect(() => {
    if (waitForTransaction.error) {
      enqueueSnackbar({
        message: waitForTransaction.error.message,
        variant: toastState[TxState.Failure],
      });
    } else if (waitForTransaction.data) {
      enqueueSnackbar({
        message: description,
        variant: toastState[TxState.Success],
      });
    } else if (waitForTransaction.isLoading) {
      enqueueSnackbar({
        message: description,
        variant: toastState[TxState.Pending],
      });
    }
  }, [
    waitForTransaction.data,
    waitForTransaction.error,
    waitForTransaction.isLoading,
  ]);

  return {
    ...usedWriteContract,
    isLoading: writeLoading || waitForTransaction.isLoading,
    walletLoading: writeLoading,
    txLoading: waitForTransaction.isLoading,
    waitData: waitForTransaction.data,
  };
};

export const useWatchSendTransactionHash = (title: string) => {
  const sendTransaction = useSendTransaction();

  return useWatchTransactionHash(title, sendTransaction);
};

const useWatchWriteTransactionHash = (description: string) => {
  const writeContract = useWriteContract();

  return useWatchTransactionHash(description, writeContract);
};

export const useExtendedSendTransaction = (
  title: string,
  args: UseSimulateContractParameters,
) => {
  const sendTransaction = useWatchSendTransactionHash(title);

  const send = useCallback(() => {
    sendTransaction.sendTransaction(args, {
      onError: (error) => {
        enqueueSnackbar({
          // @ts-ignore
          message: error?.cause?.shortMessage,
          variant: "error",
        });
        console.error(error);
      },
    });
  }, [sendTransaction, args]);

  return {
    ...sendTransaction,
    send,
  };
};

export const useApproveIfNecessary = (
  token: Address,
  target: Address,
  amount: string,
) => {
  const allowance = useAllowance(token, target);
  const approveData = useApprove(token, target, amount);
  const writeApprove = useExtendedContractWrite(
    approveData.title,
    approveData.args,
  );

  return +allowance < +amount ? writeApprove : undefined;
};

export const getTokenList = () =>
  fetch("https://tokens.coingecko.com/base/all.json").then((res) => res.json());

export const useGeckoList = () =>
  useQuery<{ tokens: Token[] } | undefined>({
    queryKey: ["tokenList"],
    queryFn: getTokenList,
  });

type Token = {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
};

export const useTokenFromList = (tokenAddress: Address) => {
  const { data } = useGeckoList();

  return data?.tokens.find((token) => token.address === tokenAddress);
};

export const getOneInchTokenList = () =>
  fetch("https://tokens.1inch.io/v1.2/8453").then((res) => res.json());

export const useOneInchTokenList = () =>
  useQuery<Record<string, Token> | undefined>({
    queryKey: ["oneInchTokenList"],
    queryFn: getOneInchTokenList,
  });

export const useNetworkId = () => {
  const { wallets } = useWallets();
  const { address } = useAccount();
  const activeWallet = wallets?.find((wallet) => wallet.address === address);

  return +activeWallet?.chainId.split(":")[1];
};