import { useState, useImperativeHandle } from 'react'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)
  const hiddenWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = async () => {
    await setVisible(!visible)
  }

  useImperativeHandle(props.ref, () => {
    return { toggleVisibility }
  })

  return(
    <div>
      <div style={hiddenWhenVisible}>
        <button onClick={() => {setVisible(true)}}>{props.buttonShow}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={() => setVisible(false)}>{props.buttonHide}</button>
      </div>
    </div>
  )

}

export default Togglable