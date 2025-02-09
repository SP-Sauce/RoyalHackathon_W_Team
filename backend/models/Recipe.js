import mongoose from "mongoose"; // ✅ Ensure this is at the top!

const RecipeSchema = new mongoose.Schema({
    recipe_name: { type: String, required: true },
    dietary_requirements: [{ 
        type: String, 
        enum: ["vegetarian", "vegan", "halal", "gluten-free", "nut-free", "dairy-free", "keto"] 
    }],
    cuisine_type: { 
        type: String,  
        enum: ["italian", "south-asian", "chinese", "middle-eastern", "japanese", "mexican"]
    },
    protein_per_serving: { type: Number, required: true },
    carbs_per_serving: { type: Number, required: true },
    fats_per_serving: { type: Number, required: true },
    calories_per_serving: { type: Number, required: true },
    ingredients: [{
        name: { type: String, required: true },
        quantity: { type: String, required: true }
    }],
    method: { type: String, required: true },
    cost_per_serving: { type: Number, required: true },
    prep_time: { type: Number, required: true },
    cook_time: { type: Number, required: true },
    servings: { type: Number, required: true },
    impact_type: { type: String, enum: ["plant_trees", "recover_plastic", "restore_coral"], required: true },
    impact_amount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Export the model correctly
export default mongoose.model("Recipe", RecipeSchema);
