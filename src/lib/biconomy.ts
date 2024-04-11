import { BalancePayload, BiconomySmartAccountV2, createSmartAccountClient } from "@biconomy/account"
import { ethers } from "ethers"
import { Address } from "viem"

import { contractsSepolia } from "config/contracts"
import { sepoliaConfig } from "config/network"

export const createBiconomySmartAccount = async (
  signer: ethers.providers.JsonRpcSigner
): Promise<BiconomySmartAccountV2> => {
  return await createSmartAccountClient({
    chainId: parseInt(sepoliaConfig.chainId),
    signer: signer,
    biconomyPaymasterApiKey: process.env.NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY,
    bundlerUrl: process.env.NEXT_PUBLIC_BICONOMY_BUNDLER_URL,
    rpcUrl: sepoliaConfig.rpcTarget,
  })
}

export const getBalances = async (
  smartAccount: BiconomySmartAccountV2
): Promise<BalancePayload[]> => {
  const erc20TokenAddress: Address = contractsSepolia.p2wToken as Address
  const daiTokenAddress: Address = contractsSepolia.dai as Address

  return await smartAccount.getBalances([erc20TokenAddress, daiTokenAddress])
}
