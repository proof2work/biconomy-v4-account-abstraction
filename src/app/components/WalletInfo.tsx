import Image from "next/image"
import {
  ArrowRightStartOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/20/solid"
import { formatUnits } from "viem"
import { BalancePayload } from "@biconomy/account"

import { shortenAddress } from "utils/strings"

interface WalletInfoProps {
  smartAccountAddress: string | null
  loading: boolean
  logout: () => void
  balances: BalancePayload[]
}

export default function WalletInfo({
  smartAccountAddress,
  loading,
  logout,
  balances,
}: WalletInfoProps) {
  return (
    <nav className="flex w-screen flex-col gap-1 md:w-fit md:flex-row md:gap-2">
      <div className="flex items-center justify-center gap-3 rounded-md bg-gray-800 px-3 py-2 font-semibold text-gray-300 transition-all duration-300 ease-in-out hover:bg-gray-700">
        <div className="flex gap-2">
          <Image
            src="/p2w-logo-64.png"
            alt="Proof2Work token Logo"
            width={24}
            height={24}
          />
          {balances.length !== 0
            ? Number(formatUnits(balances[0]?.amount, balances[0]?.decimals)).toFixed(2)
            : "-"}
        </div>
        <div className="flex gap-2">
          <Image src="/dai-logo.png" alt="Dai Logo" width={24} height={24} />
          {balances.length !== 0
            ? Number(formatUnits(balances[1]?.amount, balances[1]?.decimals)).toFixed(2)
            : "-"}
        </div>
        <div className="flex gap-2">
          <Image src="/ethereum-logo.svg" alt="Ethereum Logo" width={14} height={14} />
          {balances.length !== 0
            ? Number(formatUnits(balances[2]?.amount, balances[2]?.decimals)).toFixed(4)
            : "-"}
        </div>
      </div>

      <a
        href={`${process.env.NEXT_PUBLIC_SEPOLIA_ADDRESS_EXPLORER}${smartAccountAddress}`}
        target="_blank"
        className="flex items-center justify-center  gap-2 rounded-md bg-gray-800 px-3 py-2 font-semibold text-gray-300 transition-all duration-300 ease-in-out hover:bg-gray-700"
      >
        {smartAccountAddress && shortenAddress(smartAccountAddress)}
        <ArrowTopRightOnSquareIcon className="h-4 w-4" />
      </a>
      <a
        href={process.env.NEXT_PUBLIC_GITHUB_URL}
        target="_blank"
        className="flex items-center justify-center gap-2 rounded-md bg-gray-800 px-3 py-2 font-semibold text-gray-300 transition-all duration-300 ease-in-out hover:bg-gray-700"
      >
        <Image src="/github-logo.svg" alt="Polygon Logo" width={25} height={25} />
        <span>View Code</span>
        <ArrowTopRightOnSquareIcon className="h-4 w-4" />
      </a>
      <button
        onClick={() => logout()}
        className="inline-flex justify-center gap-2 rounded-md bg-gray-800 px-3 py-2 font-semibold text-gray-300 transition-all duration-300 ease-in-out hover:bg-gray-700"
      >
        {" "}
        {!loading ? (
          <>
            <ArrowRightStartOnRectangleIcon className="h-6 w-6" />
            <span>Logout</span>
          </>
        ) : (
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-gray-300"></div>
        )}
      </button>
    </nav>
  )
}
