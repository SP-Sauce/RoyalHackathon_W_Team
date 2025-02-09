import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
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

    const [displayedRecipes, setDisplayedRecipes] = useState([])
    const [selectedRecipe, setSelectedRecipe] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [orders, setOrders] = useState({})
    const [stats, setStats] = useState({
        totalCost: 0,
        calories: 0,
        protein: 0,
        carbohydrates: 0
    })

    // Calculate stats when orders change
    const calculateStats = useCallback(() => {
        const newStats = displayedRecipes.reduce((acc, recipe) => {
            const quantity = orders[recipe._id] || 0;
            return {
                totalCost: acc.totalCost + (recipe.cost_per_serving * quantity),
                calories: acc.calories + (recipe.calories_per_serving * quantity),
                protein: acc.protein + (recipe.protein_per_serving * quantity),
                carbohydrates: acc.carbohydrates + (recipe.carbs_per_serving * quantity)
            };
        }, {
            totalCost: 0,
            calories: 0,
            protein: 0,
            carbohydrates: 0
        });
        setStats(newStats);
    }, [displayedRecipes, orders]);

    // Set initial recipes and update stats when orders change
    useEffect(() => {
        setDisplayedRecipes(filteredRecipes);
        calculateStats();
    }, [filteredRecipes, orders, calculateStats]);

    const handleQuantityChange = useCallback((recipeId, delta) => {
        setOrders(prev => {
            const recipe = displayedRecipes.find(r => r._id === recipeId);
            const currentQty = prev[recipeId] || 0;
            const newQty = Math.max(0, currentQty + delta);

            // Check if adding would exceed budget
            const otherItemsCost = Object.entries(prev)
                .filter(([id]) => id !== recipeId)
                .reduce((sum, [id, qty]) => {
                    const r = displayedRecipes.find(recipe => recipe._id === id);
                    return sum + (r?.cost_per_serving || 0) * qty;
                }, 0);

            const newTotalCost = otherItemsCost + (recipe?.cost_per_serving || 0) * newQty;
            if (newTotalCost > budget) return prev;

            // Remove item if quantity is 0
            if (newQty === 0) {
                const { [recipeId]: _, ...rest } = prev;
                return rest;
            }

            return { ...prev, [recipeId]: newQty };
        });
    }, [displayedRecipes, budget]);

    return (
        <div className='meal-plan-overview'>
            <div className='meal-plan-leftside'>
                <div className='meal-plan-stats'>
                    <h2>Your Meal Plan</h2>
                    <div className='budget-info'>
                        <p>Budget: £{budget.toFixed(2)}</p>
                        <p>Spent: £{stats.totalCost.toFixed(2)}</p>
                        <p>Remaining: £{(budget - stats.totalCost).toFixed(2)}</p>
                    </div>
                    <div className='nutrition-stats'>
                        <h3>Nutritional Information</h3>
                        <p>Calories: {stats.calories.toFixed(0)} kcal</p>
                        <p>Protein: {stats.protein.toFixed(1)}g</p>
                        <p>Carbohydrates: {stats.carbohydrates.toFixed(1)}g</p>
                    </div>
                </div>
            </div>

            <div className='meal-plan-rightside'>
            {displayedRecipes.map((recipe) => (
                <div key={recipe._id} className="recipe-card">
                    <div className="recipe-info" onClick={() => {
                        setSelectedRecipe(recipe);
                        setIsOpen(true);
                    }}>
                        <h3>{recipe.recipe_name}</h3>
                        <div className="recipe-basic-info">
                            <p className="cuisine-type">{recipe.cuisine_type}</p>
                            <p className="time-info">
                                <span>🕒 Prep: {recipe.prep_time}m</span>
                                <span>🍳 Cook: {recipe.cook_time}m</span>
                            </p>
                            <p className="cost">£{recipe.cost_per_serving.toFixed(2)} per serving</p>
                        </div>
                        <div className="nutrition-info">
                            <span>🔥 {recipe.calories_per_serving} kcal</span>
                            <span>🥩 {recipe.protein_per_serving}g protein</span>
                        </div>
                        <p className="view-more">Click for full recipe details →</p>
                    </div>
                    <div className="quantity-controls">
                        <button 
                            onClick={() => handleQuantityChange(recipe._id, -1)}
                            disabled={!orders[recipe._id]}
                            className="quantity-button"
                        >
                            -
                        </button>
                        <span className="quantity-display">{orders[recipe._id] || 0}</span>
                        <button 
                            onClick={() => handleQuantityChange(recipe._id, 1)}
                            disabled={stats.totalCost + recipe.cost_per_serving > budget}
                            className="quantity-button"
                        >
                            +
                        </button>
                    </div>
                </div>
            ))}
        </div>

        <Modal 
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
            className="recipe-modal"
            overlayClassName="modal-overlay"
        >
            {selectedRecipe && (
                <div className="recipe-details">
                    <h2>{selectedRecipe.recipe_name}</h2>
                    
                    <div className="recipe-overview">
                        <h3>Overview</h3>
                        <div className="recipe-info-grid">
                            <p><strong>Cuisine:</strong> {selectedRecipe.cuisine_type}</p>
                            <p><strong>Cost:</strong> £{selectedRecipe.cost_per_serving.toFixed(2)}/serving</p>
                            <p><strong>Prep Time:</strong> {selectedRecipe.prep_time} mins</p>
                            <p><strong>Cook Time:</strong> {selectedRecipe.cook_time} mins</p>
                            <p><strong>Total Time:</strong> {selectedRecipe.prep_time + selectedRecipe.cook_time} mins</p>
                            <p><strong>Servings:</strong> {selectedRecipe.servings}</p>
                        </div>
                    </div>

                    <div className="recipe-requirements">
                        <h3>Dietary Requirements</h3>
                        <div className="requirements-tags">
                            {selectedRecipe.dietary_requirements?.map((req, index) => (
                                <span key={index} className="dietary-tag">
                                    {req}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="recipe-nutritional-info">
                        <h3>Nutritional Information (per serving)</h3>
                        <div className="nutrition-grid">
                            <p>🔥 Calories: {selectedRecipe.calories_per_serving} kcal</p>
                            <p>🥩 Protein: {selectedRecipe.protein_per_serving}g</p>
                            <p>🌾 Carbohydrates: {selectedRecipe.carbs_per_serving}g</p>
                            <p>🧈 Fats: {selectedRecipe.fats_per_serving}g</p>
                        </div>
                    </div>

                    <div className="recipe-ingredients">
                        <h3>Ingredients</h3>
                        <ul>
                            {selectedRecipe.ingredients?.map((ingredient, index) => (
                                <li key={index}>
                                    {ingredient.quantity} {ingredient.name}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="recipe-method">
                        <h3>Method</h3>
                        <p>{selectedRecipe.method}</p>
                    </div>

                    <button 
                        onClick={() => setIsOpen(false)}
                        className="close-modal-button"
                    >
                        Close
                    </button>
                </div>
            )}
        </Modal>
    </div>
    );
};

export default MealPlan;