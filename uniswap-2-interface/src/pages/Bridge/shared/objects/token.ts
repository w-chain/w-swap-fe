import type { Provider, Signer, ContractTransactionResponse } from "ethers";
import type { ChainId } from "../types";
import { Contract, MaxUint256 } from "ethers";
import { ERC20_ABI } from "../abi/token";
import { wait } from "../utils/time";
import { BRIDGE_CONTRACT_REGISTRY } from "../contracts/bridge";

export default class Token {
  public contract: Contract;
  public handlerContractAddress: string;

  constructor(
    public chainId: ChainId,
    public name: string, 
    public symbol: string, 
    public address: string, 
    public resourceId: string, 
    public decimals: number
  ) {
    this.contract = new Contract(address, ERC20_ABI);
    this.handlerContractAddress = BRIDGE_CONTRACT_REGISTRY[chainId].erc20Handler;
  }

  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */
  public equals(other: Token): boolean {
    // short circuit on reference equality
    if (this === other) {
      return true
    }
    return this.chainId === other.chainId && this.address === other.address
  }

  public async balanceOf(account: string, provider: Provider) {
    const balance = await (this.contract.connect(provider) as Contract).balanceOf!(account);
    return BigInt(balance);
  }

  public async allowance(owner: string, spender: string, provider: Provider) {
    const allowance = await (this.contract.connect(provider) as Contract).allowance!(owner, spender);
    return BigInt(allowance);
  }

  public async approve(spender: string, amount: bigint, signer: Signer) {
    const tx: ContractTransactionResponse = await (this.contract.connect(signer) as Contract).approve!(spender, amount);
    await wait(2000); // Fix on BSC late indexed tx
    await tx.wait();
    return tx.hash;
  }

  public async approveMax(spender: string, signer: Signer) {
    return this.approve(spender, MaxUint256, signer);
  }

  public async handlerAllowance(owner: string, provider: Provider) {
    const allowance = await (this.contract.connect(provider) as Contract).allowance!(owner, this.handlerContractAddress);
    return BigInt(allowance);
  }

  public async handlerApproveMax(signer: Signer) {
    return this.approveMax(this.handlerContractAddress, signer);
  }
}