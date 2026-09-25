import React from 'react'
import { useLocation } from 'react-router-dom'
import FishBG from '../../assets/images/fish-bg.png'
import { usesEcosystemTheme } from '../../utils/ecosystemTheme'

const FishComponent = () => {
  const location = useLocation()

  if (usesEcosystemTheme(location.pathname)) {
    return null
  }

  return <img src={FishBG} alt="" className="fish-bottom-right" />
}

export default FishComponent
