export const screenSize = () => {
  const RESOLUTIONS = {
    PHONE: 375,
    TABLET: 700,
    LAPTOP: 1200,
    DEKSTOP: 1600,
  }

  let value

  const resolutionScreen = () => {
    const currenResolution = { current: null }

    if (window.innerWidth < RESOLUTIONS.TABLET) {
      return { ...currenResolution, current: RESOLUTIONS.PHONE }
    }

    if (window.innerWidth >= RESOLUTIONS.TABLET) {
      return { ...currenResolution, current: RESOLUTIONS.TABLET }
    }
  }

  window.addEventListener('resize', () => {
    const { current } = resolutionScreen()
    value = current && current
  })

  return { value }
}

export const screenSize2 = () => {
  return new Promise((resolve) => {
    const RESOLUTIONS = {
      PHONE: 375,
      TABLET: 700,
      LAPTOP: 1200,
      DESKTOP: 1600,
    }

    const resolutionScreen = () => {
      const { PHONE, TABLET, LAPTOP, DESKTOP } = RESOLUTIONS

      if (window.innerWidth < TABLET) return PHONE
      if (window.innerWidth >= TABLET && window.innerWidth < LAPTOP)
        return TABLET
      if (window.innerWidth >= LAPTOP && window.innerWidth < DESKTOP)
        return LAPTOP
      if (window.innerWidth >= DESKTOP) return DESKTOP
    }

    window.addEventListener('resize', () => {
      const value = resolutionScreen()
      resolve(value)
    })
  })
}

screenSize2().then((value) => {
  console.log(value) // Logs the screen resolution when the window is resized
})
