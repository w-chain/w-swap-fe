/** Official W Chain ecosystem destinations (override via env for staging). */
export const WCO_ECOSYSTEM_URL =
  process.env.REACT_APP_WCO_PORTAL_URL?.replace(/\/$/, '') ?? 'https://w-chain.com/ecosystem/wco'

export const WAVE_FARM_URL =
  process.env.REACT_APP_WAVE_FARM_URL?.replace(/\/$/, '') ?? 'https://wave.w-chain.com/farm'
