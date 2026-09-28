import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { landingSearchForTab } from '../../utils/landingWidgetTab'

// Redirects to home swap widget but preserves query string
export function RedirectPathToSwapOnly({ location }: RouteComponentProps) {
  return (
    <Redirect
      to={{
        ...location,
        pathname: '/',
        search: landingSearchForTab('swap', location.search)
      }}
    />
  )
}

// Redirects from the /swap/:outputCurrency path to the /swap?outputCurrency=:outputCurrency format
export function RedirectToSwap(props: RouteComponentProps<{ outputCurrency: string }>) {
  const {
    location: { search },
    match: {
      params: { outputCurrency }
    }
  } = props

  const mergedSearch =
    search && search.length > 1
      ? `${search}&outputCurrency=${outputCurrency}`
      : `?outputCurrency=${outputCurrency}`

  return (
    <Redirect
      to={{
        ...props.location,
        pathname: '/',
        search: landingSearchForTab('swap', mergedSearch)
      }}
    />
  )
}
