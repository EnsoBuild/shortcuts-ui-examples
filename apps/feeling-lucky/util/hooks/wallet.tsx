import { useCallback, useEffect } from "react";
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
  useBlockNumber,
  useBalance,
} from "wagmi";
import { enqueueSnackbar } from "notistack";
import { Address, BaseError } from "viem";
import { useQueryClient } from "@tanstack/react-query";
import { useWallets } from "@privy-io/react-auth";
import { formatNumber, normalizeValue } from "@ensofinance/shared/util";
import { RouteParams } from "@ensofinance/sdk";
import { useTokenFromList } from "./common";
import erc20Abi from "../../erc20Abi.json";
import { useEnsoRouterData } from "./enso";
import { ETH_ADDRESS } from "../constants";

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

  return useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address],
  });
};

// if token is native ETH, use usBalance instead
export const useTokenBalance = (token: Address) => {
  const { address } = useAccount();
  const { data: erc20Balance } = useErc20Balance(token);
  const { data: balance } = useBalance({ address });

  const value = token === ETH_ADDRESS ? balance?.value : erc20Balance;

  return value?.toString() ?? "0";
};

export const useAllowance = (token: Address, spender: Address) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const blockNumber = useBlockNumber({ watch: true });
  const queryClient = useQueryClient();
  const { data, queryKey } = useReadContract({
    chainId,
    address: token,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address, spender],
    blockTag: "pending",
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [blockNumber, queryClient, queryKey]);

  return data?.toString() ?? "0";
};

export const useApprove = (token: Address, target: Address, amount: string) => {
  const tokenData = useTokenFromList(token);
  const chainId = useChainId();

  return {
    title: `Approve ${formatNumber(normalizeValue(amount, tokenData?.decimals))} of ${tokenData?.symbol} for spending`,
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
  const hash = usedWriteContract.data;
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
  tokenIn: Address,
  target: Address,
  amount: string,
) => {
  const allowance = useAllowance(tokenIn, target);
  const approveData = useApprove(tokenIn, target, amount);
  const writeApprove = useExtendedContractWrite(
    approveData.title,
    approveData.args,
  );

  if (tokenIn === ETH_ADDRESS) return undefined;

  return +allowance < +amount ? writeApprove : undefined;
};

export const useSendEnsoTransaction = (
  amountIn: string,
  tokenOut: Address,
  tokenIn: Address,
  slippage: number,
) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const preparedData: RouteParams = {
    fromAddress: address,
    receiver: address,
    spender: address,
    chainId,
    amountIn,
    slippage,
    tokenIn,
    tokenOut,
    routingStrategy: "router",
  };

  const { data: ensoData, isFetching } = useEnsoRouterData(preparedData);
  const tokenData = useTokenFromList(tokenOut);
  const tokenFromData = useTokenFromList(tokenIn);

  const sendTransaction = useExtendedSendTransaction(
    `Purchase ${formatNumber(normalizeValue(amountIn, tokenFromData?.decimals))} ${tokenFromData?.symbol} of ${tokenData?.symbol}`,
    ensoData?.tx,
  );

  return {
    sendTransaction,
    ensoData,
    isFetchingEnsoData: isFetching,
  };
};

// hack to fix wrong chain detection caused by privy
export const useNetworkId = () => {
  const { wallets } = useWallets();
  const { address } = useAccount();
  const activeWallet = wallets?.find((wallet) => wallet.address === address);

  return +activeWallet?.chainId.split(":")[1];
};
