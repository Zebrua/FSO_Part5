const Error = ({ Mess }) => {
  if (Mess === null) {
    return null
  }
  return(
    <div className='error'>
      {Mess}
    </div>
  )
}

export default Error