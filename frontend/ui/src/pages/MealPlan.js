import React, { useState, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import Meal from './MealPlanComponents/Meal'
import './index.css'
import Modal from 'react-modal'

Modal.setAppElement("#root")

const MealPlan = () => {
    const location = useLocation();
    const filteredRecipes = useMemo(() => 
        location.state?.recipes || [], 
        [location.state?.recipes]
    );
    const budget = location.state?.budget || 0;

    // Filter recipes by budget here instead of in backend
    const budgetFilteredRecipes = useMemo(() => 
        filteredRecipes.filter(recipe => recipe.cost_per_serving <= budget),
        [filteredRecipes, budget]
    );

    const [allRecipes, setAllRecipes] = useState([])
    const [displayedRecipes, setDisplayedRecipes] = useState([])
    const [selectedRecipe, setSelectedRecipe] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [stats, setStats] = useState({
        totalCost: 0,
        calories: 0,
        protein: 0,
        carbohydrates: 0
    })
    const [orders, setOrders] = useState([])
    const [total, setTotal] = useState(0)

    const budget = 30;

    // Calculate stats when recipes change
    const calculateStats = (recipesList) => {
        const newStats = recipesList.reduce((acc, recipe) => ({
            totalCost: acc.totalCost + (recipe.cost_per_serving || 0),
            calories: acc.calories + (recipe.calories_per_serving || 0),
            protein: acc.protein + (recipe.protein_per_serving || 0),
            carbohydrates: acc.carbohydrates + (recipe.carbs_per_serving || 0)
        }), {
            totalCost: 0,
            calories: 0,
            protein: 0,
            carbohydrates: 0
        });
        setStats(newStats);
    };

    // Handle filtered recipes
    useEffect(() => {
        if (budgetFilteredRecipes.length > 0) {
            setAllRecipes(budgetFilteredRecipes);
            setDisplayedRecipes(budgetFilteredRecipes);
            calculateStats(budgetFilteredRecipes);
        } else {
            // Only fetch all recipes if no filtered recipes exist
            const fetchRecipes = async () => {
                try {
                    const response = await fetch('/api/recipes');
                    const data = await response.json();
                    if (data.success) {
                        setAllRecipes(data.recipes);
                        setDisplayedRecipes(data.recipes);
                        calculateStats(data.recipes);
                    }
                } catch (error) {
                    console.error('Failed to fetch recipes:', error);
                }
            };
            fetchRecipes();
        }
    }, [budgetFilteredRecipes]);

    const viewIngredients = (e) => {
        e.preventDefault();
        const recipeName = e.currentTarget.getAttribute("data-name");
        const recipe = allRecipes.find(r => r.recipe_name === recipeName);
        setSelectedRecipe(recipe);
        setIsOpen(true);
    };

    const getTotalCost = () => {
        let sum = 0;

        for (let i = 0; i < orders.length; i++) {
            sum += orders[i];
        }

        

        setTotal(sum)
    }

    useEffect(() => {
        const sum = orders.reduce((acc, order) => acc + order, 0);
        setTotal(sum);
    }, [orders]);


    return (
        <div className='meal-plan-overview'>
            <Modal 
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                style={{
                    overlay: { backgroundColor: "rgba(0, 0, 0, 0.3)" },
                    content: { 
                        position: "absolute",
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        maxWidth: '600px',
                        width: '90%',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        borderRadius: "8px"
                    }
                }}
            >
                {/* Modal content */}
                <h2>{selectedRecipe?.recipe_name || 'Recipe Details'}</h2>
                <div className="recipe-details">
                    {selectedRecipe ? (
                        <>
                            <div className="recipe-overview">
                                <p>Cuisine: {selectedRecipe.cuisine_type}</p>
                                <p>Prep Time: {selectedRecipe.prep_time} mins</p>
                                <p>Cook Time: {selectedRecipe.cook_time} mins</p>
                                <p>Servings: {selectedRecipe.servings}</p>
                                <p>Cost per Serving: £{selectedRecipe.cost_per_serving?.toFixed(2)}</p>
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

            {/* Main content */}
            <div className='meal-plan-leftside'>
                <div className='meal-plan-bottomleft'>
                    <div className='meal-plan-bl-cost'>
                        Total cost: £{total}
                    </div>
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

            <div id='meal-plan-rightside' className='meal-plan-rightside'>
                {displayedRecipes?.map((recipe, index) => (
                    <Meal 
                        key={recipe._id || index}
                        name={recipe.recipe_name}
                        viewIngredients={viewIngredients}
                        price={recipe.cost_per_serving}
                        setOrders={setOrders}
                        orders={orders}
                        budget={budget}
                        getTotalCost={getTotalCost}
                        recipe={recipe}
                    >
                        <div className="meal-card" onClick={() => {
                            setSelectedRecipe(recipe);
                            setIsOpen(true);
                        }}>
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
                {!displayedRecipes?.length && (
                    <div className="no-recipes">
                        No recipes match your criteria
                    </div>
                )}
            </div>
        </div>
    );
};

export default MealPlan;