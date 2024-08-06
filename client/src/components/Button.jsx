import React from 'react'

const Button = (props) => {
  return (
    <button onClick={props.Logout}>{props.name}</button>
  )
}

export default Button