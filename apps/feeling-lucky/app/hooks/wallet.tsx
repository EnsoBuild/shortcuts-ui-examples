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
} from "wagmi";
import { enqueueSnackbar } from "notistack";
import { useWallets } from "@privy-io/react-auth";
import { useSetActiveWallet } from "@privy-io/wagmi";
import { BaseError } from "viem";
import erc20Abi from "../../erc20Abi.json";
import { formatNumber, normalizeValue } from "@enso/shared/util";
import { Address } from "@enso/shared/types";
import { useIsEoaEnabled, useTokenFromList } from "./common";
import { useQueryClient } from "@tanstack/react-query";

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
    title: `Approve ${formatNumber(normalizeValue(+amount, tokenData?.decimals))} of ${tokenData?.symbol} for spending`,
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

  return +allowance < +amount ? writeApprove : undefined;
};

export const useNetworkId = () => {
  const { wallets } = useWallets();
  const { address } = useAccount();
  const activeWallet = wallets?.find((wallet) => wallet.address === address);

  return +activeWallet?.chainId.split(":")[1];
};

export const useSetValidWagmiAddress = () => {
  const { address } = useAccount();
  const { wallets } = useWallets();
  const { setActiveWallet } = useSetActiveWallet();
  const isEoaEnabled = useIsEoaEnabled();

  // set wagmi active address depending on if eoa mode is enabled
  useEffect(() => {
    const targetAddress = wallets.find(
      (wallet) =>
        wallet.connectorType === (isEoaEnabled ? "embedded" : "injected"),
    );

    if (targetAddress?.address !== address) {
      console.log(`Setting active wallet to ${targetAddress.address}`);
      setActiveWallet(targetAddress).then(() =>
        console.log("Active wallet set"),
      );
    }
  }, [address, wallets]);
};
