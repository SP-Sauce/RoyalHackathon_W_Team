import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import recipeRoutes from "./routes/recipeRoutes.js";
import verdnRoutes from "./routes/verdnRoutes.js";


dotenv.config({ path: "./.env" });


const app = express();
const port = 3001;

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse incoming JSON payloads


// Check if MONGO_URI is loaded
console.log("MONGO_URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Connection Error:", err));

app.post("/add-recipes", async (req, res) => {
    try {
        const newRecipe = new Recipes(req.body);
        await newRecipe.save();
        res.status(201).json({ success: true, recipe: newRecipe });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

app.use("/api/recipes", recipeRoutes);

app.use("/api/verdn", verdnRoutes);


app.get("/", (req, res) => res.send("MealGenie API is running"));

app.listen(3001, () => console.log("Server running on port 3001"));
