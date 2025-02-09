import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './index.css'
import SelectableDiv from './DietaryReqComponents/SelectableDiv'
import Slider from './DietaryReqComponents/Slider'
import UpdateQuestionArrow from './DietaryReqComponents/UpdateQuestionArrow'

const DietaryRequirements = () => {
    const cuisines = ['South Asian', 'Italian', 'Mediterranean', 'Chinese', 'Middle-Eastern', 'Other']
    const navigate = useNavigate()
    
    // State management
    const [question, setQuestion] = useState(1)
    const [selectedCuisines, setSelectedCuisines] = useState([])
    const [budget, setBudget] = useState(500)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const dietaryRequirements = useRef()

    // Navigation handlers
    const incrementPage = () => {
        if (question === 3) {
            handleSubmit()
        } else {
            setQuestion(prev => prev + 1)
        }
    }

    const decrementPage = () => {
        setQuestion(prev => prev - 1)
    }

    // Cuisine selection handler
    const updateSelectedCuisines = (name) => {
        setSelectedCuisines(prev => 
            prev.includes(name)
                ? prev.filter(cuisine => cuisine !== name)
                : [...prev, name]
        )
    }

    // Submit handler
    const handleSubmit = async () => {
        try {
            setIsLoading(true)
            setError(null)
            
            const response = await axios.post('http://localhost:3001/api/recipes/filter', {
                cuisines: selectedCuisines,
                dietaryRequirements: dietaryRequirements.current.value.split(',').map(r => r.trim()),
                maxBudget: budget
            })

            if (response.data.success) {
                navigate('/mealplan/', { 
                    state: { recipes: response.data.recipes }
                })
            }
        } catch (error) {
            console.error('Error filtering recipes:', error)
            setError('Failed to filter recipes. Please try again.')
            setQuestion(3) // Stay on current page if error
        } finally {
            setIsLoading(false)
        }
    }

    // Generate cuisine selection elements
    const cuisineElements = cuisines.map((cuisine) => (
        <SelectableDiv 
            key={cuisine}
            updateSelectedCuisines={updateSelectedCuisines} 
            name={cuisine}
            selected={selectedCuisines.includes(cuisine)}
        >
            {cuisine}
        </SelectableDiv>
    ))

    return (
        <div className='bg center-container'>
            <div className='dtrequirements-form'>
                {error && <div className="error-message">{error}</div>}
                {isLoading && <div className="loading-spinner">Loading...</div>}
                
                {question === 1 && (
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

                {question === 2 && (
                    <div>
                        <h3>What is your monthly food budget?</h3>
                        <Slider 
                            min={0} 
                            max={1000} 
                            value={budget}
                            onChange={setBudget}
                        />
                        <div className="budget-display">£{budget}</div>
                        <UpdateQuestionArrow 
                            questionNumber={question} 
                            increment={incrementPage} 
                            decrement={decrementPage} 
                        />
                    </div>
                )}

                {question === 3 && (
                    <div>
                        <h3>What are your dietary requirements?</h3>
                        <textarea 
                            ref={dietaryRequirements}
                            placeholder="Enter requirements separated by commas (e.g., vegetarian, gluten-free)"
                            className="dietary-textarea"
                        />
                        <button 
                            onClick={handleSubmit}
                            className="submit-button"
                            disabled={isLoading}
                        >
                            Submit
                        </button>
                        <UpdateQuestionArrow 
                            questionNumber={question} 
                            increment={incrementPage} 
                            decrement={decrementPage} 
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default DietaryRequirements