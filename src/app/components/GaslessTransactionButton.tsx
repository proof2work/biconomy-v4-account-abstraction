"use client"

import { Provider } from "@ethersproject/providers"
import { BiconomySmartAccountV2, PaymasterMode } from "@biconomy/account"
import { ethers } from "ethers"
import { Address } from "viem"
import toast from "react-hot-toast"
import { useState } from "react"

import MintContractABI from "lib/contracts/MintContractABI.json"
import { contracts } from "config/contracts"

interface GaslessTransactionButtonProps {
  smartAccount: BiconomySmartAccountV2 | null
  userAddress: Address | null
  provider: Provider | null
}

export default function GaslessTransactionButton({
  smartAccount,
  userAddress,
  provider,
}: GaslessTransactionButtonProps) {
  const [loading, setLoading] = useState<boolean>(false)

  //process gasless mint transaction
  const handleGaslessTransaction = async () => {
    const request = async () => {
      try {
        if (!smartAccount || !provider) return null

        setLoading(true)
        const nftAddress: string = contracts.sepolia.p2wNft // smart contract address

        const contract = new ethers.Contract(nftAddress, MintContractABI, provider)
        const mintTx = await contract.populateTransaction.claim(
          userAddress,
          0,
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

        const userOpReceipt = await userOpResponse.wait()

        if (userOpReceipt.success != "true") {
          throw new Error("Transaction failed")
        } else {
          toast.success(
            <div className="flex flex-col items-center gap-1">
              <strong>Mint P2W NFT Successful!</strong>
              <a
                target="_blank"
                href={`${process.env.NEXT_PUBLIC_SEPOLIA_TX_EXPLORER}${transactionHash}`}
              >
                Click to see on Etherscan
              </a>
            </div>
          )
        }
        setLoading(false)
      } catch (error) {
        console.error(error)
        setLoading(false)
        throw new Error("Transaction failed")
      }
    }

    toast.promise(
      request(),
      {
        loading: "Transaction pending. Do not close window.",
        success: <b>Transaction successful!</b>,
        error: <b>Transaction failed</b>,
      },
      {
        style: {
          minWidth: "400px",
        },
      }
    )
  }

  return (
    <div className="group cursor-pointer rounded-3xl p-8 ring-1 ring-white/10 transition-all duration-300 ease-in-out hover:ring-indigo-500 xl:p-10">
      <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
        <div>
          <h2 className="text-lg font-semibold leading-8 text-white">
            Send a Gasless Transaction
          </h2>

          <p className="text-sm leading-6 text-gray-300">
            Use Biconomy Paymaster to sponsor the gas fees of a mint transaction
          </p>
        </div>
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"></div>
          </div>
        ) : (
          <a
            onClick={handleGaslessTransaction}
            className="block rounded-md bg-white/10 px-3 py-2 text-center text-sm font-semibold leading-6 text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white group-hover:bg-indigo-500"
          >
            Mint P2W NFT
          </a>
        )}
      </div>
    </div>
  )
}
