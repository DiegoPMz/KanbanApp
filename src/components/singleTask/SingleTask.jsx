import './singleTask.css'

export const SingleTask = () => {
  return (
    <li className='singleTask__item'>
      <a className='singleTask__item-link'>
        <h3 className='singleTask__item-title'>Build UI for onboarding flow</h3>
        <span className='singleTask__item-substasks'>0 of 3 substasks</span>
      </a>
    </li>
  )
}
