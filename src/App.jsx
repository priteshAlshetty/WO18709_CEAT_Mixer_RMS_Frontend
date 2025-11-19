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
import WeighingReport from './Pages/Report_Pages/WeighingReport'
import BatchReport from './Pages/Report_Pages/BatchReport'
import SummaryReport from './Pages/Report_Pages/SummaryReport'

function App() {
  return (
   <Router>
  <Navbar />
  <Routes>
    <Route path="/" element={<RecipePage />} />
    <Route path="/Material-management" element={<MaterialManagement />} />
    <Route path="/add-edit-recipe" element={<AddRecipe />} />
    <Route path="/delete-recipe" element={<DeleteRecipe />} />

    {/* Parent Report Route */}
    <Route path="/report" element={<Report />}>
      <Route path="weighing" element={<WeighingReport />} />
      <Route path="batch" element={<BatchReport />} />
      <Route path="summary" element={<SummaryReport />} />
      {/* Add more report pages here */}
    </Route>

    <Route path="/copy-recipe" element={<CopyRecipe />} />
  </Routes>
  <Footer />
</Router>

    
  )
}

export default App
