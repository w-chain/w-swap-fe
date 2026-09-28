/** Routes that use the W Chain marketing / ecosystem visual shell (cream bg, white card). */
export function usesEcosystemTheme(pathname: string): boolean {
  if (pathname === '/') return true
  if (pathname.startsWith('/swap')) return true
  if (pathname === '/pool' || pathname === '/portfolio' || pathname === '/bridge' || pathname === '/find') return true
  if (pathname === '/create' || pathname.startsWith('/add')) return true
  return false
}
