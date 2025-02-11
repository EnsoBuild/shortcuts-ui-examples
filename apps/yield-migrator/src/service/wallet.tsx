import { useCallback, useEffect, useState } from "react";
import {
  useAccount,
  useBalance,
  useChainId,
  useReadContract,
  useSendTransaction,
  UseSendTransactionReturnType,
  UseSimulateContractParameters,
  useWaitForTransactionReceipt,
  useWriteContract,
  UseWriteContractReturnType,
} from "wagmi";
import { Address, BaseError, erc20Abi } from "viem";
import { useQueryClient } from "@tanstack/react-query";
import { RouteData, RouteParams } from "@ensofinance/sdk";
import { toaster } from "@/components/ui/toaster";
import { useEtherscanUrl } from "./common";
import { ENSO_ROUTER_ADDRESS, ETH_ADDRESS } from "./constants";
import { useEnsoToken } from "./enso";
import { formatNumber, normalizeValue } from "./index";

const useInterval = (callback: () => void, interval: number) => {
  const savedCallback = useCallback(callback, []);

  useEffect(() => {
    const id = setInterval(savedCallback, interval);
    return () => clearInterval(id);
  }, [interval, savedCallback]);
};
const useChangingIndex = () => {
  const [index, setIndex] = useState(0);

  useInterval(() => {
    setIndex(index + 1);
  }, 6000);

  return index;
};

export const useErc20Balance = (tokenAddress: `0x${string}`) => {
  const { address } = useAccount();
  const chainId = useChainId();

  return useReadContract({
    chainId,
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address],
  });
};

// if token is native ETH, use usBalance instead
export const useTokenBalance = (token: Address) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const index = useChangingIndex();
  const queryClient = useQueryClient();
  const { data: erc20Balance, queryKey: erc20QueryKey } =
    useErc20Balance(token);
  const { data: balance, queryKey: balanceQueryKey } = useBalance({
    address,
    chainId,
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: erc20QueryKey });
    queryClient.invalidateQueries({ queryKey: balanceQueryKey });
  }, [index, queryClient, erc20QueryKey, balanceQueryKey]);

  const value = token === ETH_ADDRESS ? balance?.value : erc20Balance;

  return value?.toString() ?? "0";
};

export const useAllowance = (token: Address, spender: Address) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const index = useChangingIndex();
  const queryClient = useQueryClient();
  const { data, queryKey } = useReadContract({
    chainId,
    address: token,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address, spender],
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [index, queryClient, queryKey]);

  return data?.toString() ?? "0";
};

export const useApprove = (
  token: Address,
  target: Address,
  amount?: string,
) => {
  const tokenData = useEnsoToken(token);
  const chainId = useChainId();

  // add one percent so yield tokens can be swapped without needing to approve again
  const amountToApprove = (BigInt(amount ?? 0) * 101n) / 100n;

  return {
    title: `Approve ${formatNumber(normalizeValue(amountToApprove, tokenData?.decimals))} of ${tokenData?.symbol} for spending`,
    args: {
      chainId,
      address: token,
      abi: erc20Abi,
      functionName: "approve",
      args: [target, amountToApprove],
    },
  };
};

export const useExtendedContractWrite = (
  title: string,
  writeContractVariables: UseSimulateContractParameters,
) => {
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
          toaster.create({
            title: error?.shortMessage || error.message,
            type: "error",
          });
          console.error(error);
        },
      });
    }
  }, [contractWrite, writeContractVariables]);

  return {
    ...contractWrite,
    write,
  };
};

const useWatchTransactionHash = <
  T extends UseSendTransactionReturnType | UseWriteContractReturnType,
>(
  description: string,
  usedWriteContract: T,
) => {
  // const addRecentTransaction = useAddRecentTransaction();

  const { data: hash, reset } = usedWriteContract;

  // useEffect(() => {
  //   if (hash) addRecentTransaction({ hash, description });
  // }, [hash]);

  const waitForTransaction = useWaitForTransactionReceipt({
    hash,
  });
  // const link = useEtherscanUrl(hash);

  const writeLoading = usedWriteContract.status === "pending";

  // toast error if tx failed to be mined and success if it is having confirmation
  useEffect(() => {
    if (waitForTransaction.error) {
      toaster.create({
        title: waitForTransaction.error.message,
        type: "error",
      });
    } else if (waitForTransaction.data) {
      // reset tx hash to eliminate recurring notifications
      reset();
      toaster.create({
        title: description,
        type: "success",
      });
    } else if (waitForTransaction.isLoading) {
      toaster.create({
        title: description,
        type: "info",
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
  txData: UseSimulateContractParameters,
) => {
  const sendTransaction = useWatchSendTransactionHash(title);

  const send = useCallback(() => {
    sendTransaction.sendTransaction(txData, {
      onError: (error) => {
        toaster.create({
          // @ts-ignore
          title: error?.cause?.shortMessage,
          type: "error",
        });
        console.error(error);
      },
    });
  }, [sendTransaction, txData]);

  return {
    ...sendTransaction,
    send,
  };
};

export const useApproveIfNecessary = (tokenIn: Address, amount: string) => {
  const allowance = useAllowance(tokenIn, ENSO_ROUTER_ADDRESS);
  const approveData = useApprove(tokenIn, ENSO_ROUTER_ADDRESS, amount);
  const writeApprove = useExtendedContractWrite(
    approveData.title,
    approveData.args,
  );

  if (tokenIn === ETH_ADDRESS) return undefined;

  return +allowance <= +amount ? writeApprove : undefined;
};

export const useSendEnsoTransaction = (
  ensoTxData: RouteData["tx"],
  params: Pick<RouteParams, "tokenIn" | "tokenOut" | "amountIn">,
) => {
  const tokenData = useEnsoToken(params.tokenOut);
  const tokenFromData = useEnsoToken(params.tokenIn);

  return useExtendedSendTransaction(
    `Purchase ${formatNumber(normalizeValue(params.amountIn, tokenFromData?.decimals))} ${tokenFromData?.symbol} of ${tokenData?.symbol}`,
    ensoTxData,
  );
};
