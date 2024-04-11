export const shortenAddress = (address: string, chars = 4) => {
  return `${address.slice(0, chars+2)}...${address.slice(-chars)}`
}