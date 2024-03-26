import { Provider } from "@ethersproject/providers"
import MintContractABI from "lib/contracts/MintContractABI.json"
import { BiconomySmartAccountV2, PaymasterMode } from "@biconomy/account"
import { BigNumber, ethers } from "ethers"
import { Address } from "viem"
import toast from "react-hot-toast"

export const GaslessTransactionButton = ({
  smartAccount,
  userAddress,
  provider,
}: {
  smartAccount: BiconomySmartAccountV2
  userAddress: Address | null
  provider: Provider | null
}) => {
  //process gasless mint transaction
  const handleGaslessTransaction = async () => {
    const request = async () => {
      const nftAddress = "0x67Fcd0Af88F8aF020aaee955D47eE8D70C8f608b" // smart contract address

      const contract = new ethers.Contract(nftAddress, MintContractABI, provider)
      const mintTx = await contract.populateTransaction.claim(
        userAddress,
        1,
        1,
        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        0,
        [
          ["0x0000000000000000000000000000000000000000000000000000000000000000"],
          1,
          0,
          "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        ],
        "0x"
      )

      // Build the transaction
      const tx = {
        to: nftAddress,
        data: mintTx.data as string,
      }

      // Send the transaction and get the transaction hash
      const userOpResponse = await smartAccount.sendTransaction(tx, {
        paymasterServiceData: {
          mode: PaymasterMode.SPONSORED,
        },
      })
      const { transactionHash } = await userOpResponse.waitForTxHash()
      console.log("Transaction Hash", transactionHash)
      const userOpReceipt = await userOpResponse.wait()
      if (userOpReceipt.success == "true") {
        console.log("UserOp receipt", userOpReceipt)
        console.log("Transaction receipt", userOpReceipt.receipt)
      }
    }

    toast.promise(request(), {
      loading: "Waiting for transaction receipt...",
      success: <b>Gasless transaction successful</b>,
      error: <b>Transaction failed</b>,
    })
  }

  return (
    <a
      onClick={handleGaslessTransaction}
      className="block rounded-md bg-white/10 px-3 py-2 text-center text-sm font-semibold leading-6 text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white group-hover:bg-indigo-500"
    >
      Mint NFT
    </a>
  )
}
