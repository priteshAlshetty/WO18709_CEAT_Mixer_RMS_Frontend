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
import Oee_Downtime from './Pages/Oee_Downtime'
import WeighingReport from './Pages/Report_Pages/WeighingReport'
import BatchReport from './Pages/Report_Pages/BatchReport'
import SummaryReport from './Pages/Report_Pages/SummaryReport'
import ProductionReport from './Pages/Report_Pages/ProductionReport'
import CleanoutReport from './Pages/Report_Pages/CleanoutReport'
import AlarmReport from './Pages/Report_Pages/AlarmReport'
import OperatorLog from './Pages/Report_Pages/OperatorLogReport'

import DowntimeReport from './Pages/OEE_Downtime_Pages/Downtime_report'
import Oee from './Pages/OEE_Downtime_Pages/Oee'
import Batch_hold from './Pages/OEE_Downtime_Pages/Batch_hold'

function App() {
  return (
   <Router>
  <Navbar />
  <Routes>
    <Route path="/" element={<RecipePage />} />
    <Route path="/Material-management" element={<MaterialManagement />} />
    <Route path="/add-edit-recipe" element={<AddRecipe />} />
    <Route path="/delete-recipe" element={<DeleteRecipe />} />
    <Route path="/oee-downtime" element={<Oee_Downtime />} />

    {/* Parent Report Route */}
    <Route path="/report" element={<Report />}>
      <Route path="weighing" element={<WeighingReport />} />
      <Route path="batch" element={<BatchReport />} />
      <Route path="summary" element={<SummaryReport />} />
      <Route path="production" element={<ProductionReport />} />
      <Route path="cleanout" element={<CleanoutReport />} />
      <Route path="alarm" element={<AlarmReport />} />
      <Route path="operators-log" element={<OperatorLog />} />


      {/* Add more report pages here */}
    </Route>

    <Route path="/oee-downtime" element={<Oee_Downtime />}>
      <Route path="downtime-Report" element={<DowntimeReport />} />
      <Route path="oee" element={<Oee />} />
      <Route path="batch-hold" element={<Batch_hold />} />

      
      {/* Add more report pages here */}
    </Route>

    <Route path="/copy-recipe" element={<CopyRecipe />} />
  </Routes>
  <Footer />
</Router>

    
  )
}

export default App
