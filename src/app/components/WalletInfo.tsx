import Image from "next/image"
import {
  ArrowRightStartOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/20/solid"

import { shortenAddress } from "utils/strings"

const WalletInfo = ({
  smartAccountAddress,
  loading,
  logout,
  daiBalance,
  p2wBalance
}: {
  smartAccountAddress: string | null
  loading: boolean
  logout: () => void
  daiBalance: string
  p2wBalance: string
}) => {
  return (
    <nav className="flex w-screen flex-col gap-1 md:w-fit md:flex-row md:gap-2">
      <div className="flex items-center justify-center gap-3 rounded-md bg-gray-800 px-3 py-2 font-semibold text-gray-300 transition-all duration-300 ease-in-out hover:bg-gray-700">
        <div className="flex gap-2">
          <Image src="/p2w-logo.png" alt="Polygon Logo" width={24} height={24} />
          {Number(p2wBalance).toFixed(2)}
        </div>
        <div className="flex gap-2">
          <Image src="/dai-logo.png" alt="Polygon Logo" width={24} height={24} />
          {Number(daiBalance).toFixed(2)}
        </div>
      </div>

      <a
        href={"https://sepolia.etherscan.io/address/" + smartAccountAddress}
        target="_blank"
        className="flex items-center justify-center  gap-2 rounded-md bg-gray-800 px-3 py-2 font-semibold text-gray-300 transition-all duration-300 ease-in-out hover:bg-gray-700"
      >
        <Image src="/ethereum-logo.svg" alt="Polygon Logo" width={14} height={14} />
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

export default WalletInfo
