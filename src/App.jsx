import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './Components/Navbar/Navbar'
import RecipePage from './Pages/RecipePage'
import Footer from './Components/Footer/footer'
import MaterialManagement from './Pages/MaterialManagement'
import AddRecipe from './Pages/AddRecipe'
import DeleteRecipe from './Pages/DeleteRecipe'
import CopyRecipe from './Pages/CopyRecipe'
import Report from './Pages/Reports'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<RecipePage />} />
        <Route path="/Material-management" element={<MaterialManagement />} />
        <Route path="/add-edit-recipe" element={<AddRecipe />} />
        <Route path="/delete-recipe" element={<DeleteRecipe />} />
        <Route path="/report" element={<Report />} />
        <Route path="/copy-recipe" element={<CopyRecipe />} />
        
      </Routes>
      <Footer/>
    </Router>
    
  )
}

export default App
