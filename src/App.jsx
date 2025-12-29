// import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
// import './App.css'

// // Layout Components
// import Navbar from './Components/Navbar/Navbar'
// import Footer from './Components/Footer/footer'

// // Pages
// import RecipePage from './Pages/RecipePage'
// import MaterialManagement from './Pages/MaterialManagement'
// import Login from './Pages/LoginPage'
// import AddRecipe from './Pages/AddRecipe'
// import DeleteRecipe from './Pages/DeleteRecipe'
// import CopyRecipe from './Pages/CopyRecipe'
// import Report from './Pages/Reports'
// import Oee_Downtime from './Pages/Oee_Downtime'

// // Report Pages
// import WeighingReport from './Pages/Report_Pages/WeighingReport'
// import BatchReport from './Pages/Report_Pages/BatchReport'
// import SummaryReport from './Pages/Report_Pages/SummaryReport'
// import ProductionReport from './Pages/Report_Pages/ProductionReport'
// import CleanoutReport from './Pages/Report_Pages/CleanoutReport'
// import AlarmReport from './Pages/Report_Pages/AlarmReport'
// import OperatorLog from './Pages/Report_Pages/OperatorLogReport'

// // OEE & Downtime Pages
// import DowntimeReport from './Pages/OEE_Downtime_Pages/Downtime_report'
// import Oee from './Pages/OEE_Downtime_Pages/Oee'
// import Batch_hold from './Pages/OEE_Downtime_Pages/Batch_hold'

// /* ---------------- Layout Wrapper ---------------- */
// function Layout({ children }) {
//   const location = useLocation()

//   // Hide Navbar & Footer only on login page
//   const hideLayout = location.pathname === '/login'

//   return (
//     <>
//       {!hideLayout && <Navbar />}
//       {children}
//       {!hideLayout && <Footer />}
//     </>
//   )
// }

// /* ---------------- App Component ---------------- */
// function App() {
//   return (
//     <Router>
//       <Layout>
//         <Routes>

//           {/* Login Page (No Navbar/Footer) */}
//           <Route path="/login" element={<Login />} />

//           {/* Main Pages */}
//           <Route path="/" element={<RecipePage />} />
//           <Route path="/Material-management" element={<MaterialManagement />} />
//           <Route path="/add-edit-recipe" element={<AddRecipe />} />
//           <Route path="/delete-recipe" element={<DeleteRecipe />} />
//           <Route path="/copy-recipe" element={<CopyRecipe />} />

//           {/* Reports */}
//           <Route path="/report" element={<Report />}>
//             <Route path="weighing" element={<WeighingReport />} />
//             <Route path="batch" element={<BatchReport />} />
//             <Route path="summary" element={<SummaryReport />} />
//             <Route path="production" element={<ProductionReport />} />
//             <Route path="cleanout" element={<CleanoutReport />} />
//             <Route path="alarm" element={<AlarmReport />} />
//             <Route path="operators-log" element={<OperatorLog />} />
//           </Route>

//           {/* OEE & Downtime */}
//           <Route path="/oee-downtime" element={<Oee_Downtime />}>
//             <Route path="downtime-Report" element={<DowntimeReport />} />
//             <Route path="oee" element={<Oee />} />
//             <Route path="batch-hold" element={<Batch_hold />} />
//           </Route>

//         </Routes>
//       </Layout>
//     </Router>
//   )
// }

// export default App


import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react' // ⭐ NEW
import './App.css'

// Layout Components
import Navbar from './Components/Navbar/Navbar'
import Footer from './Components/Footer/footer'

// Context
import { MixerContext } from './context/MixerContext' // ⭐ NEW
import { setCurrentMixer } from './api/mixerInterceptor' // ⭐ NEW (if using interceptor)

// Pages
import RecipePage from './Pages/RecipePage'
import MaterialManagement from './Pages/MaterialManagement'
import Login from './Pages/LoginPage'
import AddRecipe from './Pages/AddRecipe'
import DeleteRecipe from './Pages/DeleteRecipe'
import CopyRecipe from './Pages/CopyRecipe'
import Report from './Pages/Reports'
import Oee_Downtime from './Pages/Oee_Downtime'
import TestMixer from './Pages/TestMixer'

// Report Pages
import WeighingReport from './Pages/Report_Pages/WeighingReport'
import BatchReport from './Pages/Report_Pages/BatchReport'
import SummaryReport from './Pages/Report_Pages/SummaryReport'
import ProductionReport from './Pages/Report_Pages/ProductionReport'
import CleanoutReport from './Pages/Report_Pages/CleanoutReport'
import AlarmReport from './Pages/Report_Pages/AlarmReport'
import OperatorLog from './Pages/Report_Pages/OperatorLogReport'

// OEE & Downtime Pages
import DowntimeReport from './Pages/OEE_Downtime_Pages/Downtime_report'
import Oee from './Pages/OEE_Downtime_Pages/Oee'
import Batch_hold from './Pages/OEE_Downtime_Pages/Batch_hold'

/* ---------------- Layout Wrapper ---------------- */
function Layout({ children }) {
  const location = useLocation()
  const hideLayout = location.pathname === '/login'

  return (
    <>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
    </>
  )
}

/* ---------------- App Component ---------------- */
function App() {
  // ⭐ GLOBAL MIXER STATE
  const [selectedMixer, setSelectedMixer] = useState('Mixer 1')

  // ⭐ Sync mixer to Axios (one-time logic)
  useEffect(() => {
    setCurrentMixer(selectedMixer)
  }, [selectedMixer])

  return (
    // ⭐ PROVIDER WRAPS ENTIRE APP
    <MixerContext.Provider value={{ selectedMixer, setSelectedMixer }}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/test-mixer" element={<TestMixer />} />


            <Route path="/login" element={<Login />} />

            <Route path="/" element={<RecipePage />} />
            <Route path="/Material-management" element={<MaterialManagement />} />
            <Route path="/add-edit-recipe" element={<AddRecipe />} />
            <Route path="/delete-recipe" element={<DeleteRecipe />} />
            <Route path="/copy-recipe" element={<CopyRecipe />} />

            <Route path="/report" element={<Report />}>
  {/* Redirect /report to /report/weighing */}
  <Route index element={<Navigate to="weighing" replace />} />

  <Route path="weighing" element={<WeighingReport />} />
  <Route path="batch" element={<BatchReport />} />
  <Route path="summary" element={<SummaryReport />} />
  <Route path="production" element={<ProductionReport />} />
  <Route path="cleanout" element={<CleanoutReport />} />
  <Route path="alarm" element={<AlarmReport />} />
  <Route path="operators-log" element={<OperatorLog />} />
</Route>

            <Route path="/oee-downtime" element={<Oee_Downtime />}>
            <Route index element={<Navigate to="downtime-Report" replace />} />
              <Route path="downtime-Report" element={<DowntimeReport />} />
              <Route path="oee" element={<Oee />} />
              <Route path="batch-hold" element={<Batch_hold />} />
            </Route>

          </Routes>
        </Layout>
      </Router>
    </MixerContext.Provider>
  )
}

export default App
