import { useEffect, useState } from 'react'

export const useScreenSize = () => {
  const [currenResolution, setCurrenResolution] = useState(null)

  const RESOLUTIONS = {
    PHONE: 375,
    TABLET: 768,
    LAPTOP: 1200,
    DEKSTOP: 1600,
  }

  const resolutionScreen = () => {
    if (window.innerWidth < RESOLUTIONS.TABLET) {
      setCurrenResolution(RESOLUTIONS.PHONE)
    }

    if (window.innerWidth >= RESOLUTIONS.TABLET) {
      setCurrenResolution(RESOLUTIONS.DEKSTOP)
    }
  }

  useEffect(() => {
    if (!currenResolution) {
      const currentRes =
        window.innerWidth < RESOLUTIONS.TABLET
          ? RESOLUTIONS.PHONE
          : RESOLUTIONS.DEKSTOP
      setCurrenResolution(currentRes)
    }

    window.addEventListener('resize', resolutionScreen)
  }, [currenResolution])

  return {
    currenResolution,
    phone: RESOLUTIONS.PHONE,
    dektop: RESOLUTIONS.DEKSTOP,
  }
}
