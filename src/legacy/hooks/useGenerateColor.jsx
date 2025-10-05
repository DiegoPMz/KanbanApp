import { useEffect, useState } from 'react'
import { generateColor } from '../helpers/generateColor'

export const useGenerateColor = () => {
  const [circleColor, setCircleColor] = useState('')

  useEffect(() => setCircleColor(generateColor()), [])

  return { circleColor }
}
