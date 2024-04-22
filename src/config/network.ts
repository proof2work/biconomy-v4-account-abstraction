import { CHAIN_NAMESPACES } from "@web3auth/base"
import { EthereumPrivKeyProviderConfig } from "@web3auth/ethereum-provider"

//Configure Sepolia network
export const sepoliaConfig: EthereumPrivKeyProviderConfig = {
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xaa36a7",
    rpcTarget: "https://ethereum-sepolia-rpc.publicnode.com",
    displayName: "Ethereum Sepolia",
    blockExplorerUrl: "https://sepolia.etherscan.io/",
    ticker: "ETH",
    tickerName: "ETH Sepolia",
  },
}
