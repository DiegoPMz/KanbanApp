export const currentTheme = () => {
  const themePrefer =
    window.matchMedia('(prefers-color-scheme: dark)').matches === true
      ? 'dark'
      : 'ligth'

  return themePrefer ?? 'dark'
}
