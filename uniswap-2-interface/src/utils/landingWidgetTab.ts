export type LandingWidgetTab = 'swap' | 'pool' | 'bridge'

const TAB_PARAM = 'tab'

export function getLandingWidgetTab(search: string): LandingWidgetTab | null {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  const tab = params.get(TAB_PARAM)
  if (tab === 'swap' || tab === 'pool' || tab === 'bridge') return tab
  return null
}

export function landingSearchForTab(tab: LandingWidgetTab, existingSearch = ''): string {
  const params = new URLSearchParams(existingSearch.startsWith('?') ? existingSearch.slice(1) : existingSearch)
  params.set(TAB_PARAM, tab)
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export function landingSearchWithoutTab(existingSearch = ''): string {
  const params = new URLSearchParams(existingSearch.startsWith('?') ? existingSearch.slice(1) : existingSearch)
  params.delete(TAB_PARAM)
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export function resolveLandingWidgetTab(search: string): LandingWidgetTab {
  return getLandingWidgetTab(search) ?? 'swap'
}
