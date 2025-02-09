![8](https://github.com/user-attachments/assets/1f4b07a5-4ad6-4bd4-9e9c-794f400fb82a)
BiteWise ReadMe
Requisites
Before starting the application, ensure you have the following installed:

Ollama (for LLM integration)
Llama 3.2 (for LLM model)
Python
Node.js
Flask
MongoDB (hosted or local instance)
Note: You will also need MongoDB Compass to manage and visualise your local MongoDB database.
Verdn API key for sustainability features
Setup Process
1. Configure LLM (First step)
Download and install Ollama for LLM integration.
Download Llama 3.2 and ensure it’s properly set up on your local machine.
Install Python and make sure it's added to your system's PATH.
2. Clone the repository
After configuring LLM, clone the repository:

bash
Copy
Edit
git clone <repository-url>
cd BiteWise
3. Install dependencies
Node.js dependencies:

bash
Copy
Edit
npm install  # Install Node.js dependencies
Python dependencies:

bash
Copy
Edit
pip install -r requirements.txt  # Install Python dependencies
4. Start MongoDB
Start MongoDB if running locally:

bash
Copy
Edit
mongod --dbpath <your-db-path>
5. Start the backend
Run the backend:

bash
Copy
Edit
python app.py
6. Start the frontend
In a separate terminal window, start the frontend:

bash
Copy
Edit
npm start
7. Access the application
You can access the application in your browser at:

http://localhost:3000

How to Run and Configure the Application
Environment Variables:
Create a .env file in the project root and configure the following:

plaintext
Copy
Edit
MONGO_URI=<your-mongodb-connection-string>
VERDN_API_KEY=<your-verdn-api-key>
LLM Configuration:
Modify the config.json file to adjust LLM parameters as needed.

Frontend Configurations:
Edit src/config.js to update API endpoints and UI settings.

Supported Inputs
Users can enter:

Meal preferences (e.g., "vegetarian", "high protein", "low carb")
Favourite cuisines (e.g., "Italian", "Indian", "Japanese")
Dietary needs (e.g., "gluten-free", "nut-free")
Budget constraints (e.g., "under £30 per week")
Number of meals to prepare
The system will generate personalised meal prep recipes, a shopping list with estimated costs, and sustainability tracking via the Verdn API.
