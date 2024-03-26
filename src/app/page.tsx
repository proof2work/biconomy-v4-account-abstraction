"use client"

import { useEffect, useState } from "react"
import {
  ArrowRightStartOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/20/solid"
import clsx from "clsx"
import { ethers } from "ethers"
import { Web3Auth } from "@web3auth/modal"
import { CHAIN_NAMESPACES } from "@web3auth/base"
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider"
import Image from "next/image"
import { createBiconomySmartAccount } from "lib/biconomy"
import { BiconomySmartAccountV2 } from "@biconomy/account"
import { GaslessTransactionButton } from "./components/GaslessTransactionButton"
import { Address } from "viem"

const tiers = [
  {
    name: "Pay Transaction Fees with ERC20",
    id: "tier-freelancer",
    href: "#",
    price: { monthly: "$15", annually: "$144" },
    description: "The essentials to provide your best work for clients.",
  },
  {
    name: "Mint NFT without paying gas",
    id: "tier-startup",
    href: "#",
    price: { monthly: "$30", annually: "$288" },
    description: "A plan that scales with your rapidly growing business.",
  },
  {
    name: "Multiple Transactions in a single transaction",
    id: "tier-enterprise",
    href: "#",
    price: { monthly: "$60", annually: "$576" },
    description: "Dedicated support and infrastructure for your company.",
  },
]

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x13881",
  rpcTarget: "https://rpc.ankr.com/polygon_mumbai",
  displayName: "Polygon Mumbai",
  blockExplorer: "https://mumbai.polygonscan.com/",
  ticker: "MATIC",
  tickerName: "Polygon Matic",
}

export default function Home() {
  const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null)
  const [smartAccount, setSmartAccount] = useState<BiconomySmartAccountV2 | null>(null)
  const [smartAccountAddress, setSmartAccountAddress] = useState<Address | null>(null)
  const [provider, setProvider] = useState<ethers.providers.Provider | null>(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      try {
        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: { chainConfig },
        })

        //Creating web3auth instance
        const web3auth = new Web3Auth({
          clientId: process.env.NEXT_PUBLIC_WEB3AUTH_API_KEY as string,
          web3AuthNetwork: "sapphire_devnet", // Web3Auth Network
          chainConfig,
          privateKeyProvider,
          uiConfig: {
            appName: "Biconomy Account Abstraction",
            mode: "dark", // light, dark or auto
            loginMethodsOrder: ["apple", "google", "twitter"],
            logoLight: "https://web3auth.io/images/web3auth-logo.svg",
            logoDark: "https://web3auth.io/images/web3auth-logo---Dark.svg",
            defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
            loginGridCol: 3,
            primaryButton: "socialLogin", // "externalLogin" | "socialLogin" | "emailLogin"
          },
        })

        await web3auth.initModal()

        if (web3auth.connected) {
          setLoggedIn(true)

          const ethersProvider = new ethers.providers.Web3Provider(
            web3auth.provider as any
          )
          const web3AuthSigner = ethersProvider.getSigner()

          const smartWallet = await createBiconomySmartAccount(
            web3AuthSigner,
            chainConfig.rpcTarget
          )
          setProvider(ethersProvider)
          setSmartAccount(smartWallet)
          const saAddress = await smartWallet.getAccountAddress()
          console.log("Smart Account Address", saAddress)
          setSmartAccountAddress(saAddress)
        }
        setWeb3Auth(web3auth)
        setLoading(false)
      } catch (error) {
        console.error(error)
        setLoading(false)
      }
    }

    init()
  }, [])

  //create smart account
  const connect = async () => {
    setLoading(true)
    if (!web3Auth) return null
    try {
      const web3AuthProvider = await web3Auth.connect()

      if (web3Auth.connected) {
        setLoggedIn(true)

        const ethersProvider = new ethers.providers.Web3Provider(web3AuthProvider as any)
        const web3AuthSigner = ethersProvider.getSigner()

        const smartWallet = await createBiconomySmartAccount(
          web3AuthSigner,
          chainConfig.rpcTarget
        )

        setProvider(ethersProvider)
        setSmartAccount(smartWallet)
        const saAddress = await smartWallet.getAccountAddress()
        console.log("Smart Account Address", saAddress)
        setSmartAccountAddress(saAddress)
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)

    if (!web3Auth) return

    await web3Auth.logout()
    setProvider(null)
    setLoggedIn(false)
    setSmartAccount(null)
    setSmartAccountAddress(null)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-900 ">
      <nav className=" flex justify-end p-8">
        {loggedIn ? (
          <div className="flex gap-2">
            <a
              href={"https://mumbai.polygonscan.com/address/" + smartAccountAddress}
              target="_blank"
              className="flex items-center gap-2 rounded-md bg-gray-800 px-3 py-2 font-semibold text-gray-300 transition-all duration-300 ease-in-out hover:bg-gray-700"
            >
              <Image src="/polygon-logo.svg" alt="Polygon Logo" width={20} height={20} />
              {smartAccountAddress &&
                smartAccountAddress.slice(0, 6) + "..." + smartAccountAddress.slice(-4)}
              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
            </a>
            <button
              onClick={() => logout()}
              className="inline-flex gap-2 rounded-md bg-gray-800 px-3 py-2 font-semibold text-gray-300 transition-all duration-300 ease-in-out hover:bg-gray-700"
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
          </div>
        ) : (
          <button
            onClick={() => connect()}
            className="rounded-lg bg-indigo-500 px-3 py-2 font-semibold text-white transition-all duration-300 ease-in-out hover:bg-indigo-400"
          >
            Sign In
          </button>
        )}
      </nav>

      <div className="py-12">
        <div className="flex flex-col items-center justify-center">
          <div className="text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-400">
              Biconomy SDK v4
            </h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Account Abstraction by Examples
            </p>
          </div>
          <p className="mt-6 max-w-3xl text-center text-lg leading-8 text-gray-300">
            Let's explore how to implement account abstraction in your dapp with Biconomy
          </p>

          <div className="my-8 flex justify-center">
            {loading && (
              <div className="flex items-center justify-center gap-2">
                <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"></div>
              </div>
            )}
            {!loggedIn && !loading && (
              <>
                <button
                  className="rounded-lg bg-indigo-500 px-4 py-3 text-xl font-bold text-white transition-all duration-300 ease-in-out hover:bg-indigo-400"
                  onClick={() => connect()}
                >
                  Sign in with Social Login
                </button>
              </>
            )}
          </div>
          {loggedIn && (
            <div className="flex flex-col items-center gap-8">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className="group cursor-pointer rounded-3xl p-8 ring-1 ring-white/10 transition-all duration-300 ease-in-out hover:ring-indigo-500 xl:p-10"
                >
                  <div className="flex items-center justify-between gap-8">
                    <div>
                      <h3
                        id={tier.id}
                        className="text-lg font-semibold leading-8 text-white"
                      >
                        {tier.name}
                      </h3>

                      <p className="text-sm leading-6 text-gray-300">
                        {tier.description}
                      </p>
                    </div>
                    <GaslessTransactionButton
                      smartAccount={smartAccount}
                      userAddress={smartAccountAddress}
                      provider={provider}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
