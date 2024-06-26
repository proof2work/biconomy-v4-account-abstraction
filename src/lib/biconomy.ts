import {
  BalancePayload,
  BiconomySmartAccountV2,
  createSmartAccountClient,
} from "@biconomy/account"
import { ethers } from "ethers"
import { Address } from "viem"

import { contracts } from "config/contracts"
import { sepoliaConfig } from "config/network"

export const createBiconomySmartAccount = async (
  signer: ethers.providers.JsonRpcSigner
): Promise<BiconomySmartAccountV2> => {
  return await createSmartAccountClient({
    chainId: parseInt(sepoliaConfig.chainConfig.chainId),
    signer: signer,
    biconomyPaymasterApiKey: process.env.NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY,
    bundlerUrl: process.env.NEXT_PUBLIC_BICONOMY_BUNDLER_URL as string,
    rpcUrl: sepoliaConfig.chainConfig.rpcTarget,
  })
}

export const getBalances = async (
  smartAccount: BiconomySmartAccountV2
): Promise<BalancePayload[]> => {
  const erc20TokenAddress: Address = contracts.sepolia.p2wToken as Address
  const daiTokenAddress: Address = contracts.sepolia.dai as Address

  return await smartAccount.getBalances([erc20TokenAddress, daiTokenAddress])
}
