import { useEffect, useState } from 'react'
import { generateColor } from '../helpers/generateColor'

export const useGenerateColor = () => {
  const [circleColor, setCircleColor] = useState('')

  useEffect(() => {
    setCircleColor(generateColor())
  }, [])

  return { circleColor }
}

// import { useEffect, useRef } from 'react'
// import { generateColor } from '../helpers/generateColor'

// export const useGenerateColor = () => {
//   const circleColor = useRef('')

//   useEffect(() => {
//     if (!circleColor.current) {
//       circleColor.current = generateColor()
//     }
//   }, [])

//   return { circleColor: circleColor.current }
// }
