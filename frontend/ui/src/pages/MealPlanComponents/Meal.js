import React from 'react'
import { IoMenu } from "react-icons/io5";
import { IconContext } from 'react-icons/lib';

const Meal = ({children, viewIngredients, name}) => {
  return (
    <div 
        onClick={(event) => viewIngredients(event)}
        className='meal-list-updt'
        data-name={name}
    >
        <div>
            {children}
            <IconContext.Provider value={{size: '2em'}}>
                <IoMenu />
            </IconContext.Provider>
        </div>
    </div>
  )
}

export default Meal