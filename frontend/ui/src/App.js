import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Nav from "./template/Nav";
import DietaryRequirements from "./pages/DietaryRequirements";
import ShoppingList from "./pages/ShoppingListComponent/ShoppingList";
import MealPlan from "./pages/MealPlan";
import ChatPage from "./pages/ChatPage"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Nav />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="/shopping-list" element={<ShoppingList />} />
          <Route path="dietary" element={<DietaryRequirements />} />
          <Route path="ai-chat" element={<ChatPage />} /> {/* New route */}
          <Route path="mealplan" element={<MealPlan />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
