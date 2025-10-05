export function generateBrightColor() {
  // Genera un número aleatorio entre 204 y 221
  function getRandomComponent() {
    return Math.floor(Math.random() * (221 - 210 + 1)) + 204
  }

  // Convierte el número a una cadena hexadecimal
  function toHex(c) {
    const hex = c.toString(16)
    return hex.length == 1 ? '0' + hex : hex
  }

  const r = getRandomComponent()
  const g = getRandomComponent()
  const b = getRandomComponent()

  // Combina los componentes en un color hexadecimal
  const color = '#' + toHex(r) + toHex(g) + toHex(b)
  console.log(color)

  return color
}

export const generateColor = () => {
  const HEXADECIMAL_COLOR = 6
  const hexaColorValue = []

  for (let index = 0; index < HEXADECIMAL_COLOR; index++) {
    const randomNumber = Math.round(Math.random() * 9)
    hexaColorValue.push(randomNumber)
  }

  const colorCreated = '#' + hexaColorValue.join('')

  return hexaColorValue.length > 1 && colorCreated
}
