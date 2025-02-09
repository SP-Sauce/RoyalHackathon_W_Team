import React, { useState, useEffect } from 'react'
import MealWeek from './MealPlanComponents/MealWeek'
import Meal from './MealPlanComponents/Meal'
import './index.css'
import Modal from 'react-modal'

Modal.setAppElement("#root")

const MealPlan = () => {
    const mealPlans = ['Week1', 'Week2', 'Week3', 'Week4']
    const meals = ['1', '2', '3', '4', '5', '6', '7']
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    const [allRecipes, setAllRecipes] = useState([])
    const [displayedRecipes, setDisplayedRecipes] = useState([])
    const [mealPlanView, setMealPlanView] = useState('Week1')
    const [recipes, setRecipes] = useState([])
    const [selectedRecipe, setSelectedRecipe] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [stats, setStats] = useState({
        totalCost: 0,
        calories: 0,
        protein: 0,
        carbohydrates: 0
    })

    // Fetch recipes when component mounts
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await fetch('/api/recipes')
                const data = await response.json()
                if (data.success) {
                    setAllRecipes(data.recipes)
                    // Initially show Week1 recipes
                    const week1Recipes = data.recipes.slice(0, 7)
                    setDisplayedRecipes(week1Recipes)
                    setRecipes(data.recipes) // Keep for backward compatibility
                    calculateStats(week1Recipes)
                }
            } catch (error) {
                console.error('Failed to fetch recipes:', error)
            }
        }
        fetchRecipes()
    }, [])

    // Add new useEffect for week changes
    useEffect(() => {
        if (allRecipes.length > 0) {
            const weekNumber = parseInt(mealPlanView.replace('Week', ''))
            const startIndex = (weekNumber - 1) * 7
            const weekRecipes = allRecipes.slice(startIndex, startIndex + 7)
            setDisplayedRecipes(weekRecipes)
            calculateStats(weekRecipes)
        }
    }, [mealPlanView, allRecipes])

    // Calculate statistics based on recipes
    const calculateStats = (recipesList) => {
        const stats = recipesList.reduce((acc, recipe) => {
            return {
                totalCost: acc.totalCost + (recipe.cost_per_serving || 0),
                calories: acc.calories + (recipe.calories_per_serving || 0),
                protein: acc.protein + (recipe.protein_per_serving || 0),
                carbohydrates: acc.carbohydrates + (recipe.carbs_per_serving || 0)
            }
        }, {
            totalCost: 0,
            calories: 0,
            protein: 0,
            carbohydrates: 0
        })
        setStats(stats)
    }

    // Update viewIngredients to use recipe_name
    const viewIngredients = (e) => {
        e.preventDefault()
        const recipeName = e.currentTarget.getAttribute("data-name")
        const recipe = allRecipes.find(r => r.recipe_name === recipeName) // Changed from recipes to allRecipes
        setSelectedRecipe(recipe)
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
                <h2>{selectedRecipe?.recipe_name || 'Recipe Details'}</h2>
                <div className="recipe-details">
                    {selectedRecipe ? (
                        <>
                            <div className="recipe-overview">
                                <p>Cuisine: {selectedRecipe.cuisine_type}</p>
                                <p>Prep Time: {selectedRecipe.prep_time} mins</p>
                                <p>Cook Time: {selectedRecipe.cook_time} mins</p>
                                <p>Servings: {selectedRecipe.servings}</p>
                                <p>Cost per Serving: £{selectedRecipe.cost_per_serving}</p>
                            </div>
                            <div className="dietary-requirements">
                                <h3>Dietary Requirements:</h3>
                                <ul>
                                    {selectedRecipe.dietary_requirements?.map((req, index) => (
                                        <li key={index}>{req}</li>
                                    ))}
                                </ul>
                            </div>
                            <h3>Ingredients:</h3>
                            <ul>
                                {selectedRecipe.ingredients?.map((ingredient, index) => (
                                    <li key={index}>{ingredient.quantity} {ingredient.name}</li>
                                ))}
                            </ul>
                            <h3>Method:</h3>
                            <p>{selectedRecipe.method}</p>
                            <div className="recipe-nutrition">
                                <h3>Nutritional Information (per serving):</h3>
                                <p>Calories: {selectedRecipe.calories_per_serving} kcal</p>
                                <p>Protein: {selectedRecipe.protein_per_serving}g</p>
                                <p>Carbs: {selectedRecipe.carbs_per_serving}g</p>
                                <p>Fats: {selectedRecipe.fats_per_serving}g</p>
                            </div>
                        </>
                    ) : (
                        <p>No recipe selected</p>
                    )}
                </div>
                <button onClick={() => setIsOpen(false)}>Close</button>
            </Modal>

            {/* left side */}
            <div className='meal-plan-leftside'>
                {/* Meal weeks */}
                <div className='meal-list'>
                    {mealPlans.map((item, index) => (
                        <MealWeek 
                            key={index}
                            id={index+1} 
                            mealPlanView={mealPlanView} 
                            toggleMealPlanView={toggleMealPlanView}
                        >
                            {item}
                        </MealWeek>
                    ))}
                </div>
                {/* Statistics */}
                <div className='meal-plan-bottomleft'>
                    {/*Total cost */}
                    <div className='meal-plan-bl-cost'>
                        Total cost: £{stats.totalCost.toFixed(2)}
                    </div>
                    {/* Vertical stats */}
                    <div className='meal-plan-bl-col'>
                        <div className='meal-plan-bl-col-element'>
                            Calories: {stats.calories.toFixed(0)} kcal
                        </div>
                        <div className='meal-plan-bl-col-element'>
                            Protein: {stats.protein.toFixed(1)}g
                        </div>
                        <div className='meal-plan-bl-col-element'>
                            Carbohydrates: {stats.carbohydrates.toFixed(1)}g
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side */}
            <div id='meal-plan-rightside' className='meal-plan-rightside'>
    {displayedRecipes && displayedRecipes.map((recipe, index) => (
        <Meal 
            key={index}
            name={recipe.recipe_name}
            viewIngredients={viewIngredients}
        >
            <div className="meal-card" onClick={(e) => {
                e.preventDefault();
                setSelectedRecipe(recipe);
                setIsOpen(true);
            }}>
                <div className="day-label">{daysOfWeek[index]}</div>
                <h3>{recipe.recipe_name}</h3>
                <p>{recipe.cuisine_type} • {recipe.prep_time + recipe.cook_time} mins</p>
                <p>£{(recipe.cost_per_serving || 0).toFixed(2)} per serving</p>
                <div className="meal-nutrition">
                    <span>{recipe.calories_per_serving || 0} kcal</span>
                    <span>{recipe.protein_per_serving || 0}g protein</span>
                </div>
            </div>
        </Meal>
    ))}
</div>
        </div>
    )
}

export default MealPlan