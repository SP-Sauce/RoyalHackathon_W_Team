import React from "react";
import "./about.css";

function About() {
  return (
    <div className="about-container">
      {/* Logo at the top */}
      <img src="logo.png" alt="Logo" className="main-logo" />

      {/* About the Application */}
      <div className="about-box">
        <h2>About Our App 🍽️</h2>
        <p>
          Ever stared at your fridge, wondering what to cook? Our AI-powered meal planner creates
          bespoke meal plans based on your needs—whether you're a student on a budget, a gym-goer
          tracking macros, or just someone looking for fresh meal ideas.  
        </p>
        <p>
          By optimizing ingredients and reducing waste, we help you save money 💰 while ensuring
          every meal is delicious, nutritious, and affordable.
        </p>
      </div>

      {/* Hackathon Story */}
      <div className="hackathon-box">
        <h2>24-Hour Hackathon Madness ⏳</h2>
        <p>
          Four developers, zero sleep, and one ambitious idea. In just 24 hours, we transformed
          caffeine and code into an AI-driven meal planner.  
        </p>
        <p>
          From last-minute UI tweaks to unexpected bugs 🐛, every challenge made us push harder.
          The journey was intense, but the result was worth it—an app designed to make meal planning
          stress-free and smarter.
        </p>
      </div>

      {/* APIs We Use */}
      <div className="api-box">
        <h2>The Magic Behind the Scenes ✨</h2>
        <p>
          Our app runs on cutting-edge technology, integrating multiple APIs to deliver a seamless experience.
          The Verdant API ensures real-time data handling, OpenAI powers intelligent meal recommendations,
          and custom-built connectors automate everything, making meal planning faster and easier.
        </p>
        <p>
          These technologies work together to save you time, effort, and money.
        </p>
      </div>

      {/* Verdant API */}
      <div className="verdn-box">
        <h2>Verdant API: The Brain Behind It All 🧠</h2>
        <img src="verdn.png" alt="Verdant API Logo" className="verdn-logo" />
        <p>
          The Verdant API is at the heart of our meal-planning engine, ensuring every recommendation
          is fast, efficient, and optimized. It processes vast amounts of data in real-time, helping
          our AI deliver personalized meal plans that fit your budget and lifestyle.
        </p>
        <p>
          Want to learn more? Check it out: <a href="https://verdantapi.com" target="_blank" rel="noopener noreferrer">Verdant API</a>.
        </p>
      </div>
    </div>
  );
}

export default About;