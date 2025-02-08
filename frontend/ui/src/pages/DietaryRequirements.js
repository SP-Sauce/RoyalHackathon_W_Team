import React, { useRef, useState, useEffect } from 'react'
import { LuSendHorizontal } from "react-icons/lu";
import './index.css'
import SelectableDiv from './DietaryReqComponents/SelectableDiv';
import Slider from './DietaryReqComponents/Slider';
import UpdateQuestionArrow from './DietaryReqComponents/UpdateQuestionArrow';

const DietaryRequirements = () => {
    const cuisines = ['South Asian', 'Italian', 'Mediterranean', 'Chinese', 'Middle-Eastern', 'Other']

    const cuisineElements = cuisines.map(cuisine => (<SelectableDiv>{cuisine}</SelectableDiv>))

    const [question, setQuestion] = useState(1)

    const incrementPage = () => {
      setQuestion(prevQuestion => prevQuestion + 1)
    }

    const decrementPage = () => {
      setQuestion(prevQuestion => prevQuestion - 1)
    }

    return (
        <div className='bg center-container '>
            <div className='dtrequirements-form'>
                    {question ==1 && (
                        <div>
                            <h3>What are your favorite cuisines?</h3>
                            <div className='floating-selectable-divs'>
                                {cuisineElements} 
                            </div>
                            <UpdateQuestionArrow questionNumber={question} increment={incrementPage} decrement={decrementPage} />
                        </div>
                    )}
                    {question == 2 && (
                        <div>
                            <h3> What is your monthly food budget?</h3>
                            <Slider min={0} max={1000} />
                            <UpdateQuestionArrow questionNumber={question} increment={incrementPage} decrement={decrementPage} />
                        </div>
                    )}
                    {question == 3 && (
                        <div>
                            <h3>What are your dietary requirements?</h3>
                            <textarea />
                            <UpdateQuestionArrow questionNumber={question} increment={incrementPage} decrement={decrementPage} />
                        </div>
                    )}
                
            </div>
        </div>
  )
}

export default DietaryRequirements