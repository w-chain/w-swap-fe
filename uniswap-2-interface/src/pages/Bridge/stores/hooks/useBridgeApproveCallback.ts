import { getTokenBySymbol } from "../../shared/registry/tokens";
import { TokenSymbols } from "../../shared/types";
import { useMemo } from "react";
import { useApproveCallback } from "../../../../hooks/useApproveCallback";
import { constants, utils } from "ethers";
import { getTokenAsUniV2Token } from "../../shared/utils";
import { TokenAmount } from "@uniswap/sdk";

export function useBridgeApproveCallback(
  tokenSymbol?: TokenSymbols,
  chainId?: number,
  amountToApprove?: number
) {
  const bridgeToken = useMemo(() => {
    if (!chainId || !tokenSymbol) return null;
    return getTokenBySymbol(chainId, tokenSymbol);
  }, [chainId, tokenSymbol]);
  
  const spender = useMemo(() => {
    return bridgeToken?.handlerContractAddress;
  }, [bridgeToken]);
  
  const tokenAmount = useMemo(() => {
    if (!tokenSymbol || !chainId) return undefined;
    const uniToken = getTokenAsUniV2Token(tokenSymbol, chainId);
    const amount = amountToApprove ? utils.parseUnits(String(amountToApprove), uniToken.decimals) : constants.MaxUint256
    return new TokenAmount(uniToken, amount.toString());
  }, [tokenSymbol, chainId, amountToApprove]);
  
  return useApproveCallback(tokenAmount, spender);
}
