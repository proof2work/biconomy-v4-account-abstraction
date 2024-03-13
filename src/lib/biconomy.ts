import {
  createSmartAccountClient,
  BiconomySmartAccountV2,
  PaymasterMode,
} from "@biconomy/account"
import { ethers } from "ethers"

export const createBiconomySmartAccount = async (signer: ethers.providers.JsonRpcSigner, rpcUrl: string) => {
  const smartWallet = await createSmartAccountClient({
    chainId: 80001,
    signer: signer,
    biconomyPaymasterApiKey: process.env.NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY,
    bundlerUrl: process.env.NEXT_PUBLIC_BICONOMY_BUNDLER_URL,
    rpcUrl: rpcUrl,
  })

  console.log("Biconomy Smart Account", smartWallet)

  return smartWallet
}
