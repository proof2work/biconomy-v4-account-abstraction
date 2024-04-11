import { CHAIN_NAMESPACES } from "@web3auth/base"

export interface NetworkConfig {
  chainNamespace: string
  chainId: string
  rpcTarget: string
  displayName: string
  blockExplorer: string
  ticker: string
  tickerName: string
}

//Configure Sepolia network
export const sepoliaConfig: NetworkConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7",
  rpcTarget: "https://ethereum-sepolia-rpc.publicnode.com",
  displayName: "Ethereum Sepolia",
  blockExplorer: "https://sepolia.etherscan.io/",
  ticker: "ETH",
  tickerName: "ETH Sepolia",
}
