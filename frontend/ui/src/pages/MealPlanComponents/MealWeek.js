import React from 'react'

const MealWeek = ({children, toggleMealPlanView, mealPlanView, id}) => {

  return (
    <div 
        id={id} 
        className={(mealPlanView==children) ? 'weekly-meal-plan selected-meal-plan' : 'weekly-meal-plan unselected-meal-plan'} 
        onClick={(event) => toggleMealPlanView(event)}
    >{children}
    </div>
  )
}

export default MealWeek