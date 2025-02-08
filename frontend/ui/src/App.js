import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Nav from "./template/Nav";
import DietaryRequirements from "./pages/DietaryRequirements";
import MealPlan from "./pages/MealPlan";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Nav />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="dietary" element={<DietaryRequirements />} />
          <Route path="mealplan" element={<MealPlan />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
