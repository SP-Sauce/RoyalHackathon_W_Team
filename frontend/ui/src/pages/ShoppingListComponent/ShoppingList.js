import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ShoppingList.css";

const ShoppingList = () => {
    const navigate = useNavigate();
    const [verdnResponse, setVerdnResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 🌱 **Call Verdn API to Pledge Sustainability Impact**
    const handleSustainabilityPledge = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/verdn/pledge-shopping", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({})
            });

            const data = await response.json();
            if (data.success) {
                setVerdnResponse(data.data);
            } else {
                console.error("Verdn API Error:", data.error);
                setError("Failed to pledge sustainability impact.");
            }
        } catch (error) {
            console.error("Verdn API Error:", error);
            setError("Something went wrong while connecting to the server.");
        }

        setLoading(false);
    };

    return (
        <div className="shopping-list-container">
            <div className="shopping-list-box">
                <h2 className="shopping-list-title">🛒 Your Shopping List</h2>
                <h3 className="shopping-list-total">
    💰 Total Cost: £{verdnResponse ? verdnResponse.totalCost : "Loading..."}
</h3>
                {/* 🌱 Sustainability Button */}
                <button className="confirm-button" onClick={handleSustainabilityPledge} disabled={loading}>
                    {loading ? "Processing..." : "Pledge Sustainability Impact 🌍"}
                </button>

                {/* ❌ Show Error Message */}
                {error && <p className="error-message">⚠️ {error}</p>}

                {/* ✅ Show Verdn Impact Response */}
                {verdnResponse && (
                    <div className="sustainability-summary">
                        <h3>🌿 Sustainability Impact</h3>
                        <p>🌳 Trees Planted: {verdnResponse.carbon_impact / 21}</p>
                        <p>💧 Water Saved: {verdnResponse.water_usage}L</p>
                        <p>🌱 Sustainability Score: {verdnResponse.sustainability_score}/100</p>
                    </div>
                )}

                {/* 🏠 Back Button */}
                <button className="confirm-button" onClick={() => navigate("/")}>
                    Back to Meal Plan
                </button>
            </div>
        </div>
    );
};

export default ShoppingList;
