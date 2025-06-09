export enum Networks {
  ETH = 'ETH',
  BSC = 'BSC',
  WCHAIN = 'WCHAIN'
}

export const getNetworkImage = (network: Networks): string => {
  switch (network) {
    case Networks.ETH:
      return '/images/networks/ethereum.png'
    case Networks.BSC:
      return '/images/networks/bsc.png'
    case Networks.WCHAIN:
      return '/images/networks/wchain.png'
    default:
      return ''
  }
} 