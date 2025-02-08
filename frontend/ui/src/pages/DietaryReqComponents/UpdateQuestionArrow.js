import React from 'react'
import { FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa";
import { IconContext } from 'react-icons/lib';

const UpdateQuestionArrow = ({questionNumber, increment, decrement}) => {
  
    return(
        <IconContext.Provider value={{size: '2rem'}}>
            <div className='container'>
                { questionNumber > 1 && <button className='invisible-btn-left' onClick={decrement}><FaArrowCircleLeft /></button>}
                { questionNumber < 3 && <button className='invisible-btn-right' onClick={increment}><FaArrowCircleRight /></button>}
            </div>
        </IconContext.Provider>

    )
}

export default UpdateQuestionArrow