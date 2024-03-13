"use client"

import { useEffect, useState } from "react"
import { RadioGroup } from "@headlessui/react"
import { CheckIcon, ArrowRightStartOnRectangleIcon } from "@heroicons/react/20/solid"
import clsx from "clsx"
import { ethers } from "ethers"
import { Web3Auth } from "@web3auth/modal"
import { CHAIN_NAMESPACES, IProvider } from "@web3auth/base"
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider"
import Image from "next/image"
import { createBiconomySmartAccount } from "lib/biconomy"

const tiers = [
  {
    name: "Buy ERC20 with ERC20",
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
  const [smartAccountAddress, setSmartAccountAddress] = useState<string | null>(null)
  const [provider, setProvider] = useState<IProvider | null>(null)
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
          clientId: process.env.NEXT_PUBLIC_WEB3AUTH_API_KEY,
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
          setProvider(web3auth.provider)
          setLoggedIn(true)

          const ethersProvider = new ethers.providers.Web3Provider(
            web3auth.provider as any
          )
          const web3AuthSigner = ethersProvider.getSigner()

          const smartWallet = await createBiconomySmartAccount(
            web3AuthSigner,
            chainConfig.rpcTarget
          )

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
        setProvider(web3AuthProvider)
        setLoggedIn(true)

        const ethersProvider = new ethers.providers.Web3Provider(web3AuthProvider as any)
        const web3AuthSigner = ethersProvider.getSigner()

        const smartWallet = await createBiconomySmartAccount(
          web3AuthSigner,
          chainConfig.rpcTarget
        )

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
            <span className="inline-flex gap-2 rounded-md bg-gray-800 px-3 py-2 font-semibold text-gray-300">
              <Image src="/polygon-logo.svg" alt="Polygon Logo" width={20} height={20} />
              {smartAccountAddress &&
                smartAccountAddress.slice(0, 6) + "..." + smartAccountAddress.slice(-4)}
            </span>
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

      <div className="py-24 sm:py-32">
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

          <div className="my-10 flex justify-center">
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
            <div className="flex items-center justify-center gap-10">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className={clsx(
                    tier.mostPopular
                      ? "bg-white/5 ring-2 ring-indigo-500"
                      : "ring-1 ring-white/10",
                    "rounded-3xl p-8 xl:p-10"
                  )}
                >
                  <div className="flex items-center justify-between gap-x-4">
                    <h3
                      id={tier.id}
                      className="text-lg font-semibold leading-8 text-white"
                    >
                      {tier.name}
                    </h3>
                    {tier.mostPopular ? (
                      <p className="rounded-full bg-indigo-500 px-2.5 py-1 text-xs font-semibold leading-5 text-white">
                        Most popular
                      </p>
                    ) : null}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-gray-300">
                    {tier.description}
                  </p>
                  <a
                    href={tier.href}
                    aria-describedby={tier.id}
                    className={clsx(
                      tier.mostPopular
                        ? "bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500"
                        : "bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white",
                      "mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    )}
                  >
                    See Demo
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
