// ChatPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css';

const ChatPage = () => {
  const navigate = useNavigate();
  const [userPrompt, setUserPrompt] = useState('');
  const [budget, setBudget] = useState(500); // Optional: allow user to adjust the budget if needed.
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rawResponse, setRawResponse] = useState(null); // For displaying the full microservice output
  const [parsedResponse, setParsedResponse] = useState(null); // For storing the parsed JSON from the AI model

  // Handler for submitting the user's query
  const handleSubmit = async () => {
    if (!userPrompt) {
      setError('Please enter a query.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRawResponse(null);
    setParsedResponse(null);

    try {
      // 1. Send the user's prompt to the AI conversion endpoint.
      // This endpoint uses your trained Ollama model (via your Python microservice)
      // to convert the prompt into a JSON string stored in the "response" field.
      const aiResponse = await axios.post(
        'http://localhost:5003/api/ai_chat',
        { prompt: userPrompt },
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Save the raw microservice output so you can inspect it.
      setRawResponse(aiResponse.data);

      // 2. Extract and parse the "response" field from the microservice output.
      // We expect the "response" field to be a JSON string.
      const parsedOutput = JSON.parse(aiResponse.data.response);
      setParsedResponse(parsedOutput);

      // The parsedOutput is expected to be an object like:
      // { "cuisines": "south-asian", "dietary_requirements": ["nut-free"] }
      // Transform it into the format required by the filtering endpoint.
      const cuisines = parsedOutput.cuisines && parsedOutput.cuisines.toLowerCase() !== 'null'
        ? [parsedOutput.cuisines.toLowerCase()]
        : [];
      const dietaryRequirements = parsedOutput.dietary_requirements || [];

      console.log("Parsed AI-derived filter:", { cuisines, dietaryRequirements });

      // 3. Send the transformed filter data to your backend filtering endpoint.
      const filterResponse = await axios.post(
        'http://localhost:3001/api/recipes/filter',
        { cuisines, dietaryRequirements },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (filterResponse.data.success) {
        // Instead of automatically redirecting, display the results first.
        navigate('/mealplan', {
          state: {
            recipes: filterResponse.data.recipes,
            budget: budget,
          },
        });
      } else {
        setError('No matching recipes found.');
      }
    } catch (err) {
      console.error("Error processing AI query:", err.response || err);
      setError('Failed to process your query. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for switching to the manual process.
  const handleManualRedirect = () => {
    navigate('/dietary');
  };

  return (
    <div className="bg center-container">
      <div className="chat-form">
        <h3>Enter your recipe query in natural language:</h3>
        {error && <div className="error-message">{error}</div>}
        {isLoading && <div className="loading-spinner">Loading...</div>}
        <textarea
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder="Type your query here..."
          className="chat-textarea"
        />
        <div className="navigation-buttons">
          <button onClick={handleSubmit} className="submit-button" disabled={isLoading}>
            Submit
          </button>
          <button onClick={handleManualRedirect} className="manual-button" disabled={isLoading}>
            Use Manual Form
          </button>
        </div>
        {rawResponse && (
          <div className="chat-response">
            <h4>Raw Microservice Response:</h4>
            <pre>{JSON.stringify(rawResponse, null, 2)}</pre>
          </div>
        )}
        {parsedResponse && (
          <div className="parsed-response">
            <h4>Parsed AI Filter:</h4>
            <pre>{JSON.stringify(parsedResponse, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
