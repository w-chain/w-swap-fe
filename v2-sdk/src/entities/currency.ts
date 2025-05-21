import JSBI from 'jsbi'
import { ChainId } from '../constants'
import { SolidityType } from '../constants'
import { validateSolidityTypeInstance } from '../utils'

/**
 * A currency is any fungible financial instrument on Ethereum, including Ether and all ERC20 tokens.
 *
 * The only instance of the base class `Currency` is Ether.
 */
export class Currency {
  public readonly decimals: number
  public readonly symbol?: string
  public readonly name?: string

  /**
   * The only instance of the base class `Currency`.
   */
  public static readonly ETHER: Currency = new Currency(18, 'ETH', 'Ethereum')
  public static readonly WCO: Currency = new Currency(18, 'WCO', 'WCO')
  public static readonly BNB: Currency = new Currency(18, 'BNB', 'BNB')

  getSymbol(chainId: ChainId) {
    switch (chainId) {
      case ChainId.WCHAIN:
      case ChainId.WCHAIN_TESTNET:
        return Currency.WCO.symbol
      case ChainId.BNB:
        return Currency.BNB.symbol
      default:
        return Currency.ETHER.symbol
    }
  }
  /**
   * Constructs an instance of the base class `Currency`. The only instance of the base class `Currency` is `Currency.ETHER`.
   * @param decimals decimals of the currency
   * @param symbol symbol of the currency
   * @param name of the currency
   */
  protected constructor(decimals: number, symbol?: string, name?: string) {
    validateSolidityTypeInstance(JSBI.BigInt(decimals), SolidityType.uint8)

    this.decimals = decimals
    this.symbol = symbol
    this.name = name
  }
}

const ETHER = Currency.ETHER
export { ETHER }
