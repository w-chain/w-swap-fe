export function formatBalance(amount: number | string | null | undefined, maxDecimals = 2): string {
  if (amount === null || amount === undefined) return '0'
  
  const numAmount = typeof amount === 'string' ? Number(amount) : amount
  
  if (typeof numAmount !== 'number' || isNaN(numAmount) || !isFinite(numAmount)) {
    return '0'
  }

  // Modified large number formatting to avoid rounding
  if (numAmount >= 50000) {
    if (numAmount >= 1000000) {
      // Floor division by 1M and format
      const millions = Math.floor((numAmount / 1000000) * Math.pow(10, maxDecimals)) / Math.pow(10, maxDecimals)
      return millions.toFixed(maxDecimals) + 'M'
    }
    // Floor division by 1K and format
    const thousands = Math.floor((numAmount / 1000) * Math.pow(10, maxDecimals)) / Math.pow(10, maxDecimals)
    return thousands.toFixed(maxDecimals) + 'K'
  }

  // Regular number formatting
  const parts = numAmount.toString().split('.')
  parts[0] = parts[0]!.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  if (parts[1]) {
    parts[1] = parts[1].slice(0, maxDecimals)
  }
  return parts.join('.')
}

export function roundDownLastDecimal(number: number): number {
  const stringNumber = number.toString();
  const decimalIndex = stringNumber.indexOf('.');
  if (decimalIndex === -1) {
    return number;
  }
  const integerPart = stringNumber.substring(0, decimalIndex);
  const decimalPart = stringNumber.substring(decimalIndex + 1);
  const roundedDecimalPart = decimalPart.substring(0, decimalPart.length - 1);
  return Number(integerPart + '.' + roundedDecimalPart);
}