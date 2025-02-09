import React, { useRef, useState, useEffect } from 'react'
import { LuSendHorizontal } from "react-icons/lu";
import './index.css'
import SelectableDiv from './DietaryReqComponents/SelectableDiv';
import Slider from './DietaryReqComponents/Slider';
import UpdateQuestionArrow from './DietaryReqComponents/UpdateQuestionArrow';
import { CSSTransition } from "react-transition-group";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DietaryRequirements = () => {
    const cuisines = ['South Asian', 'Italian', 'Mediterranean', 'Chinese', 'Middle-Eastern', 'Other']


    const [question, setQuestion] = useState(1)

    const incrementPage = () => {
      setQuestion(prevQuestion => prevQuestion + 1)
    }

    const decrementPage = () => {
      setQuestion(prevQuestion => prevQuestion - 1)
    }

    const [selectedCuisines, setSelectedCuisines] = useState([])

    const navigate = useNavigate()

    const dietaryRequirements = useRef()

    // POST REQUEST------------------------------------------------------------------
    useEffect(() => {
        if(question >= 4){

            axios.post('http://localhost:5000/api/recipes/filter', {
                cuisines,
                dietaryRequirements: dietaryRequirements.current.value
            })

            navigate('/mealplan/')
        }
    }, [question])
    // --------------------------------------------------------------------------------

    const updateSelectedCuisines = (name) => {
        if(!selectedCuisines.includes(name)){
            setSelectedCuisines(prevSelectedCuisines => [...prevSelectedCuisines, name])
        } else{
            setSelectedCuisines(prevSelectedCuisines => prevSelectedCuisines.filter(cuisine => cuisine !== name))
        }
    }

    useEffect(() => {
        console.log(selectedCuisines); // Logs the correct updated value
      }, [selectedCuisines]);

    const cuisineElements = cuisines.map((cuisine) => (<SelectableDiv 
        updateSelectedCuisines={updateSelectedCuisines} 
        name={cuisine}
        >{cuisine}
    </SelectableDiv>))


    return (
        <div className='bg center-container '>
            <div className='dtrequirements-form'>
                    {question ==1 && (
                        <div>
                            <h3>What are your favorite cuisines?</h3>
                            <div className='floating-selectable-divs'>
                                {cuisineElements} 
                            </div>
                            <UpdateQuestionArrow 
                                questionNumber={question} 
                                increment={incrementPage} 
                                decrement={decrementPage}
                             />
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
                            <textarea ref={dietaryRequirements} />
                            <UpdateQuestionArrow questionNumber={question} increment={incrementPage} decrement={decrementPage} />
                        </div>
                    )}
                
            </div>
        </div>
  )
}

export default DietaryRequirements