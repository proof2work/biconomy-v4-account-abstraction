'use client'

import { Provider } from "@ethersproject/providers"
import { BiconomySmartAccountV2 } from "@biconomy/account"
import { Address } from "viem"
import { useState } from "react"

export const BatchTransactionButton = ({
  smartAccount,
  userAddress,
  provider,
}: {
  smartAccount: BiconomySmartAccountV2
  userAddress: Address | null
  provider: Provider | null
}) => {
  const [loading, setLoading] = useState<boolean>(false)

  const handleBatchTransaction = async () => {}

  return (
    <div className="group cursor-pointer rounded-3xl p-8 ring-1 ring-white/10 transition-all duration-300 ease-in-out hover:ring-indigo-500 xl:p-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h3 className="text-lg font-semibold leading-8 text-white">
            Send a Batch of Transaction
          </h3>

          <p className="text-sm leading-6 text-gray-300">
            Make a swap on a DEX (approve + swap) in a single transaction
          </p>
        </div>
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"></div>
          </div>
        ) : (
          <a
            onClick={handleBatchTransaction}
            className="block rounded-md bg-white/10 px-3 py-2 text-center text-sm font-semibold leading-6 text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white group-hover:bg-indigo-500"
          >
            Swap Tokens
          </a>
        )}
      </div>
    </div>
  )
}
