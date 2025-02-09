import React, { useState } from 'react'
import '../index.css'

const SelectableDiv = ({children, updateSelectedCuisines, name}) => {
    const [selected, setSelected] = useState(false)

    const toggleSelect = () => {
      setSelected(prevSelected => !prevSelected)
      updateSelectedCuisines(name)
    }

    return (
      <div>
        <div onClick={toggleSelect} data-name={name} className={selected ? 'selectable-div selected' : 'selectable-div'}>
          <p>{children}</p>
        </div>
        {children === 'Other' && selected && (<input type='text' placeholder='Please specify' />)}
      </div>

  )
}

export default SelectableDiv