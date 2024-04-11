'use client'

import { Provider } from "@ethersproject/providers"
import { BiconomySmartAccountV2, PaymasterMode } from "@biconomy/account"
import { ethers } from "ethers"
import toast from "react-hot-toast"
import { useState } from "react"

import { contractsSepolia } from "config/contracts"

export const PayFeesWithERC20Button = ({
  smartAccount,
  provider,
}: {
  smartAccount: BiconomySmartAccountV2 | null
  provider: Provider | null
}) => {
  const [loading, setLoading] = useState<boolean>(false)

  //process gasless mint transaction
  const handlePayFeesWithERC20 = async () => {
    const request = async () => {
      try {
        if (!smartAccount || !provider) return null

        setLoading(true)
        const erc20Address = contractsSepolia.p2wToken // smart contract address
        const erc20ABI = ["function claim() public"]

        const contract = new ethers.Contract(erc20Address, erc20ABI, provider)
        const claimTx = await contract.populateTransaction.claim()

        // Build the transaction
        const tx = {
          to: erc20Address,
          data: claimTx.data as string,
        }

        // Send the transaction and get the transaction hash
        const userOpResponse = await smartAccount.sendTransaction(tx, {
          paymasterServiceData: {
            mode: PaymasterMode.ERC20,
            preferredToken: contractsSepolia.dai,
          },
        })
        const { transactionHash } = await userOpResponse.waitForTxHash()
        console.log("Transaction Hash", transactionHash)
        toast.success(
          <a target="_blank" href={`${process.env.NEXT_PUBLIC_SEPOLIA_TX_EXPLORER}${transactionHash}`}>
            Click to see on Etherscan
          </a>
        )

        const userOpReceipt = await userOpResponse.wait()
        console.log("UserOp receipt", userOpReceipt)
        setLoading(false)
        if (userOpReceipt.success != "true") {
          throw new Error("Transaction failed")
        }
      } catch (error) {
        console.error(error)
        setLoading(false)
        throw new Error("Transaction failed")
      }
    }

    toast.promise(
      request(),
      {
        loading: "Transaction pending...",
        success: <b>Transaction successful!</b>,
        error: <b>Transaction failed</b>,
      },
      {
        style: {
          minWidth: "300px",
        },
      }
    )
  }

  return (
    <div className="group cursor-pointer rounded-3xl p-8 ring-1 ring-white/10 transition-all duration-300 ease-in-out hover:ring-indigo-500 xl:p-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h3 className="text-lg font-semibold leading-8 text-white">
            Pay for gas with ERC20 token
          </h3>

          <p className="text-sm leading-6 text-gray-300">
            Use your Biconomy Smart Account to pay for gas fees with ERC20 token
          </p>
        </div>
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"></div>
          </div>
        ) : (
          <a
            onClick={handlePayFeesWithERC20}
            className="block rounded-md bg-white/10 px-3 py-2 text-center text-sm font-semibold leading-6 text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white group-hover:bg-indigo-500"
          >
            Claim P2W Token
          </a>
        )}
      </div>
    </div>
  )
}
