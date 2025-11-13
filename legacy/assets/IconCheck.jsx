export const IconCheck = ({ className }) => {
  return (
    <>
      <svg
        className={className ? `iconCheck-icon ${className}` : 'iconCheck-icon'}
        width='10'
        height='8'
        xmlns='http://www.w3.org/2000/svg'>
        <path
          stroke='currentColor'
          strokeWidth='2'
          fill='none'
          d='m1.276 3.066 2.756 2.756 5-5'
        />
      </svg>
    </>
  )
}
