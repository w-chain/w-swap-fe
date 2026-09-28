/** Marketing site (footer links, W Chain home). Use http://localhost:3000 in local dev. */
export const W_CHAIN_SITE_URL =
  process.env.REACT_APP_W_CHAIN_SITE_URL?.replace(/\/$/, '') ?? 'https://www.w-chain.com'

/** Official W Chain ecosystem destinations (override via env for staging). */
export const WCO_ECOSYSTEM_URL =
  process.env.REACT_APP_WCO_PORTAL_URL?.replace(/\/$/, '') ?? 'https://w-chain.com/ecosystem/wco'

export const WAVE_FARM_URL =
  process.env.REACT_APP_WAVE_FARM_URL?.replace(/\/$/, '') ?? 'https://wave.w-chain.com/farm'

/** Validator / history API for in-app bridge (same service as bridge.w-chain.com unless overridden). */
export const BRIDGE_API_BASE =
  process.env.REACT_APP_BRIDGE_API_URL?.replace(/\/$/, '') ?? 'https://bridge.w-chain.com'
