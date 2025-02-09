import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './index.css'
import SelectableDiv from './DietaryReqComponents/SelectableDiv'
import Slider from './DietaryReqComponents/Slider'
//import UpdateQuestionArrow from './DietaryReqComponents/UpdateQuestionArrow'

const DietaryRequirements = () => {
    const cuisines = ['south asian', 'italian', 'mediterranean', 'chinese', 'middle-eastern', 'other']
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
        if (question > 1) {
            setQuestion(prev => prev - 1)
        }
    }

    // Cuisine selection handler
    const updateSelectedCuisines = (name) => {
        setSelectedCuisines(prev => 
            prev.includes(name)
                ? prev.filter(cuisine => cuisine !== name)
                : [...prev, name]
        )
    }

    const handleSubmit = async () => {
        try {
            if (selectedCuisines.length === 0) {
                setError('Please select at least one cuisine')
                setQuestion(1)
                return
            }
    
            const dietaryReqs = dietaryRequirements.current?.value.trim()
            if (!dietaryReqs) {
                setError('Please enter dietary requirements')
                return
            }
    
            setIsLoading(true)
            setError(null)
            
            // Clean and validate dietary requirements
            const cleanedDietaryReqs = dietaryReqs
                .split(',')
                .map(req => req.trim().toLowerCase())
                .filter(req => req.length > 0)  // Remove empty entries
    
            if (cleanedDietaryReqs.length === 0) {
                setError('Please enter valid dietary requirements')
                return
            }
    
            const requestBody = {
                cuisines: selectedCuisines.map(c => c.toLowerCase()),
                dietaryRequirements: cleanedDietaryReqs
            }
            
            console.log('Sending request with:', JSON.stringify(requestBody, null, 2))
                
            const response = await axios.post('http://localhost:3001/api/recipes/filter', requestBody)
        
            if (response.data.success) {
                if (response.data.recipes.length === 0) {
                    setError('No recipes found matching your criteria')
                    return
                }
                navigate('/mealplan', { 
                    state: { 
                        recipes: response.data.recipes,
                        budget: budget
                    }
                })
            }
        } catch (error) {
            console.error('Request failed:', error.response || error)
            setError('Failed to filter recipes. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='bg center-container'>
            <div className='dtrequirements-form'>
                {error && <div className="error-message">{error}</div>}
                {isLoading && <div className="loading-spinner">Loading...</div>}
                
                {question === 1 && (
                    <div className="question-container">
                        <h3>What are your favorite cuisines?</h3>
                        <div className='floating-selectable-divs'>
                            {cuisines.map((cuisine) => (
                                <SelectableDiv 
                                    key={cuisine}
                                    updateSelectedCuisines={updateSelectedCuisines} 
                                    name={cuisine}
                                    selected={selectedCuisines.includes(cuisine)}
                                >
                                    {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                                </SelectableDiv>
                            ))}
                        </div>
                        <div className="navigation-buttons">
                            <button 
                                onClick={decrementPage} 
                                className="nav-button"
                                disabled={question === 1}
                            >
                                Back
                            </button>
                            <button 
                                onClick={incrementPage} 
                                className="nav-button"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {question === 2 && (
                    <div className="question-container">
                        <h3>What is your monthly food budget?</h3>
                        <Slider 
                            min={0} 
                            max={1000} 
                            value={budget}
                            onChange={setBudget}
                        />
                        <div className="budget-display">£{budget}</div>
                        <div className="navigation-buttons">
                            <button 
                                onClick={decrementPage} 
                                className="nav-button"
                            >
                                Back
                            </button>
                            <button 
                                onClick={incrementPage} 
                                className="nav-button"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {question === 3 && (
                    <div className="question-container">
                        <h3>What are your dietary requirements?</h3>
                        <textarea 
                            ref={dietaryRequirements}
                            placeholder="Enter requirements separated by commas (e.g., vegetarian, gluten-free, halal)"
                            className="dietary-textarea"
                            defaultValue=""  // Ensure it starts empty
                            aria-label="Dietary Requirements"
                        />
                        <div className="navigation-buttons">
                            <button 
                                onClick={decrementPage} 
                                className="nav-button"
                            >
                                Back
                            </button>
                            <button 
                                onClick={handleSubmit}
                                className="submit-button"
                                disabled={isLoading}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DietaryRequirements