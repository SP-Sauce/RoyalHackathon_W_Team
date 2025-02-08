import React, { useState } from 'react'
import '../index.css'

const SelectableDiv = ({children}) => {
    const [selected, setSelected] = useState(false)

    const toggleSelect = () => {
      setSelected(prevSelected => !prevSelected)
    }

    return (
      <div>
        <div onClick={toggleSelect} className={selected ? 'selectable-div selected' : 'selectable-div'}>
          <p>{children}</p>
        </div>
        {children === 'Other' && selected && (<input type='text' placeholder='Please specify' />)}
      </div>

  )
}

export default SelectableDiv