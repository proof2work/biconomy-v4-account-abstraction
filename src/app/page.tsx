"use client"

import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { Web3Auth } from "@web3auth/modal"
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider"
import { BiconomySmartAccountV2 } from "@biconomy/account"
import { Address, formatEther } from "viem"

import { createBiconomySmartAccount, getBalances } from "lib/biconomy"
import { sepoliaConfig } from "config/network"
import GaslessTransactionButton from "./components/GaslessTransactionButton"
import PayFeesWithERC20Button from "./components/PayFeesWithERC20Button"
import WalletInfo from "./components/WalletInfo"
import Footer from "ui/Footer"
import Button from "ui/Button"

export default function Home() {
  const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null)
  const [smartAccount, setSmartAccount] = useState<BiconomySmartAccountV2 | null>(null)
  const [smartAccountAddress, setSmartAccountAddress] = useState<Address | null>(null)
  const [provider, setProvider] = useState<ethers.providers.Provider | null>(null)
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [daiBalance, setDaiBalance] = useState<string>("")
  const [p2wBalance, setP2wBalance] = useState<string>("")

  /* Init Biconomy smart wallet */
  useEffect(() => {
    const init = async () => {
      try {
        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: { chainConfig: sepoliaConfig },
        })

        //Creating web3auth instance
        const web3auth = new Web3Auth({
          clientId: process.env.NEXT_PUBLIC_WEB3AUTH_API_KEY as string,
          web3AuthNetwork: "sapphire_devnet", // Web3Auth Network
          chainConfig: sepoliaConfig,
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
          const smartWallet = await createBiconomySmartAccount(web3AuthSigner)
          const balances = await getBalances(smartWallet)
          const saAddress = await smartWallet.getAccountAddress()

          setP2wBalance(formatEther(balances[0].amount))
          setDaiBalance(formatEther(balances[1].amount))
          setProvider(ethersProvider)
          setSmartAccount(smartWallet)
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

  /* Connect with social login and create Biconomy wallet */
  const connect = async () => {
    setLoading(true)
    if (!web3Auth) return null
    try {
      const web3AuthProvider = await web3Auth.connect()

      if (web3Auth.connected) {
        setLoggedIn(true)

        const ethersProvider = new ethers.providers.Web3Provider(web3AuthProvider as any)
        const web3AuthSigner = ethersProvider.getSigner()

        const smartWallet = await createBiconomySmartAccount(web3AuthSigner)
        const saAddress = await smartWallet.getAccountAddress()
        const balances = await getBalances(smartWallet)

        setP2wBalance(formatEther(balances[0].amount))
        setDaiBalance(formatEther(balances[1].amount))
        setProvider(ethersProvider)
        setSmartAccount(smartWallet)
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
    <div className="relative min-h-screen">
      <header className="flex p-8 md:justify-end">
        {loggedIn ? (
          <WalletInfo
            smartAccountAddress={smartAccountAddress}
            loading={loading}
            logout={logout}
            daiBalance={daiBalance}
            p2wBalance={p2wBalance}
          />
        ) : (
          <Button title="Sign In" onClick={connect} />
        )}
      </header>
      <main>
        <div className="py-12">
          <div className="flex flex-col items-center justify-center">
            <div className="text-center">
              <p className="text-base font-semibold leading-7 text-indigo-400">
                Biconomy SDK v4
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Account Abstraction by Examples
              </h1>
            </div>
            <p className="mt-6 max-w-3xl text-center text-lg leading-8 text-gray-300">
              Let&apos;s explore how to implement account abstraction in your dapp with
              Biconomy
            </p>

            <div className="my-8 flex justify-center">
              {loading && (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"></div>
                </div>
              )}
              {!loggedIn && !loading && (
                <Button title="Sign in with Social Login" onClick={connect} />
              )}
            </div>
            {loggedIn && (
              <div className="flex flex-col items-center gap-8">
                <GaslessTransactionButton
                  smartAccount={smartAccount}
                  userAddress={smartAccountAddress}
                  provider={provider}
                />
                <PayFeesWithERC20Button smartAccount={smartAccount} provider={provider} />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
