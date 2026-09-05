const Notification = ({ Message }) => {
  if (Message === null) {
    return null
  }
  return (
    <div className='confirmation'>
      {Message}
    </div>
  )
}

export default  Notification