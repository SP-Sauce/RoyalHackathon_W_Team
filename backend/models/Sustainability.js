import mongoose from "mongoose";

const SustainabilitySchema = new mongoose.Schema({
    recipe_id: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe", required: true },
    carbon_impact: { type: Number, default: 0 },  
    water_usage: { type: Number, default: 0 },  
    sustainability_score: { type: Number, default: 0 },  
    rating: { type: Number, required: false },  // 🔥 Fixed: Made `rating` optional
    name: { type: String, required: false },  // 🔥 Fixed: Made `name` optional
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Sustainability", SustainabilitySchema);
