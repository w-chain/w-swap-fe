import React from 'react'
import { useLocation } from 'react-router-dom'
import FishBG from '../../assets/images/fish-bg.png'

const FishComponent = () => {
  const location = useLocation()
  const isLandingPage = location.pathname === '/'

  if (!isLandingPage) {
    return <img src={FishBG} alt="" className="fish-bottom-right" />
  }

  return null
}

export default FishComponent
