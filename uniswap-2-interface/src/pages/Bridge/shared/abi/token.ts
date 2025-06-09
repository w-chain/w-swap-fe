export const ERC20_ABI = [
  'function allowance(address owner, address spender) view returns (uint256 remaining)',
  'function approve(address spender, uint256 amount) returns (bool success)',
  'function decimals() external view returns (uint8)',
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool success)',
  'function name() external view returns (string memory)',
  'function symbol() external view returns (string memory)',
  'function totalSupply() external view returns (uint256)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool success)'
];