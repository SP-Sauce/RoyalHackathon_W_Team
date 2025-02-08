import React, { useState } from 'react'
import MealWeek from './MealPlanComponents/MealWeek'
import Meal from './MealPlanComponents/Meal'
import './index.css'
import Modal from 'react-modal';


Modal.setAppElement("#root");

const MealPlan = () => {
    const mealPlans = ['Week1', 'Week2', 'Week3', 'Week4']
    const meals = ['1', '2', '3', '4', '5', '6', '7']

    const [mealPlanView, setMealPlanView] = useState('Week1')
    const [recipes, setRecipes] = useState()
    const [isOpen, setIsOpen] = useState(false)

    const viewIngredients = (e) => {
        e.preventDefault();
        setRecipes(e.currentTarget.getAttribute("data-name"))
        setIsOpen(true)
        
    }

    const toggleMealPlanView = (e) => {
      setMealPlanView(`Week${e.target.id}`)
    }

    return (
        <div className='meal-plan-overview'>
            <Modal 
                isOpen={isOpen}
                parentSelector={() => document.getElementById('meal-plan-rightside')}
                onRequestClose={() => setIsOpen(false)}
                style={{
                    overlay: { backgroundColor: "rgba(0, 0, 0, 0.3)" }, 
                    content: { position: "absolute", inset: "10px", borderRadius: "8px" },
                  }}
                >
                <h2>Modal</h2>
                <p>{recipes ? recipes : 'none'}</p>
                <button onClick={() => setIsOpen(false)}>Close</button>
            </Modal>
            {/* left side */}
            <div className='meal-plan-leftside'>
                {/* Meal weeks */}
                <div className='meal-list'>
                    {mealPlans.map((item, index) => <MealWeek 
                        id={index+1} 
                        mealPlanView={mealPlanView} 
                        toggleMealPlanView={(event) => toggleMealPlanView(event)}
                        >{item}
                        </MealWeek>)}
                </div>
                {/* Statistics */}
                <div className='meal-plan-bottomleft'>
                    {/*Total cost */}
                    <div className='meal-plan-bl-cost'>
                        Total cost: 

                    </div>
                    {/* Vertical stats */}
                    <div className='meal-plan-bl-col'>
                        <div className='meal-plan-bl-col-element'>Calories: </div>
                        <div className='meal-plan-bl-col-element'>Protein: </div>
                        <div className='meal-plan-bl-col-element'>Carbohydrates: </div>
                    </div>

                </div>
            </div>
            {/* Right side */}

            <div id='meal-plan-rightside' className='meal-plan-rightside'>
                {meals.map((meal, index) => <Meal name={`meal_${index}`} viewIngredients={(event) => viewIngredients(event)}>{meal}</Meal>)}
            </div>
            
        </div>
  )
}

export default MealPlan