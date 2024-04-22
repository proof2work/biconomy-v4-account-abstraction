"use client"

import { Provider } from "@ethersproject/providers"
import { BiconomySmartAccountV2, PaymasterMode } from "@biconomy/account"
import { ethers } from "ethers"
import toast from "react-hot-toast"
import { useState } from "react"
import { EllipsisHorizontalIcon, Bars2Icon } from "@heroicons/react/20/solid"

import { contracts } from "config/contracts"

interface PayFeesWithERC20ButtonProps {
  smartAccount: BiconomySmartAccountV2 | null
  provider: Provider | null
  refresh: () => void
}

export default function PayFeesWithERC20Button({
  smartAccount,
  provider,
  refresh,
}: PayFeesWithERC20ButtonProps) {
  const [loading, setLoading] = useState<boolean>(false)

  //process gasless mint transaction
  const handlePayFeesWithERC20 = async () => {
    const request = async () => {
      try {
        if (!smartAccount || !provider) return null
        setLoading(true)
        /***  Claim DAI Token ***/
        const daiAddress = contracts.sepolia.dai // smart contract address
        const daiABI = ["function publicMint() public payable"]

        const daiContract = new ethers.Contract(daiAddress, daiABI, provider)
        const daiClaimTx = await daiContract.populateTransaction.publicMint()

        const daiTx = {
          to: daiAddress,
          data: daiClaimTx.data as string,
          value: ethers.utils.parseEther("0.0001").toString(),
        }

        const userOpResponseDaiClaim = await smartAccount.sendTransaction(daiTx, {
          paymasterServiceData: {
            mode: PaymasterMode.SPONSORED,
          },
        })

        const { transactionHash: transactionHashDaiClaim } =
          await userOpResponseDaiClaim.waitForTxHash()

        const userOpReceiptDaiClaim = await userOpResponseDaiClaim.wait()

        if (userOpReceiptDaiClaim.success != "true") {
          throw new Error("Transaction failed")
        } else {
          toast.success(
            <div className="flex flex-col items-center gap-1">
              <strong>Claim DAI Token Successful!</strong>
              <a
                target="_blank"
                href={`${process.env.NEXT_PUBLIC_SEPOLIA_TX_EXPLORER}${transactionHashDaiClaim}`}
              >
                Click to see on Etherscan
              </a>
            </div>
          )
        }

        /*** Claim p2w Token ***/
        const erc20Address = contracts.sepolia.p2wToken // smart contract address
        const erc20ABI = ["function claim() public "]

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
            preferredToken: contracts.sepolia.dai,
          },
        })
        const { transactionHash } = await userOpResponse.waitForTxHash()

        const userOpReceipt = await userOpResponse.wait()

        // setLoading(false)
        if (userOpReceipt.success != "true") {
          throw new Error("Transaction failed")
        } else {
          toast.success(
            <div className="flex flex-col items-center gap-1">
              <strong>Claim P2W Token Successful!</strong>
              <a
                target="_blank"
                href={`${process.env.NEXT_PUBLIC_SEPOLIA_TX_EXPLORER}${transactionHash}`}
              >
                Click to see on Etherscan
              </a>
            </div>
          )
        }

        refresh()
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
      <div className="flex flex-col justify-between gap-8">
        <div>
          <h2 className="mb-4 text-2xl font-semibold leading-8 text-white">
            Batch Transaction
          </h2>

          <h3 className="text-lg font-semibold leading-8 text-white">
            1. Gasless Transaction
          </h3>

          <p className="text-sm leading-6 text-gray-300">
            {"Let's get some testnet DAI token (gas is on the Paymaster's bill again!)"}
            <div className="text-red-400">
              You need to send SepoliaETH to your smart account first.
            </div>
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold leading-8 text-white">
            2. Pay for gas with ERC20 token
          </h3>

          <p className="text-sm leading-6 text-gray-300">
            {"Let's claim P2W tokens using the DAI we just got in our smart account"}
          </p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <button className="block rounded-md bg-white/10 px-3 py-2 text-center text-sm font-semibold leading-6 text-white ">
            Claim DAI Token
          </button>
          <EllipsisHorizontalIcon width={30} className="text-white/90" />
          <button className="block rounded-md bg-white/10 px-3 py-2 text-center text-sm font-semibold leading-6 text-white ">
            Claim P2W Token
          </button>
          <Bars2Icon width={20} className="text-white/90" />
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"></div>
            </div>
          ) : (
            <a
              onClick={handlePayFeesWithERC20}
              className="block rounded-md bg-white/10 px-3 py-2 text-center text-sm font-semibold leading-6 text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white group-hover:bg-indigo-500"
            >
              Batch Transaction
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
