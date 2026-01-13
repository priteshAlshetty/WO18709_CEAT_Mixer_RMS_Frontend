
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
import GraphPage from './Pages/Graphpage'
import MixerSelection from './Pages/Mixer_Selection_Screen'

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

  const hideNavbar =
    location.pathname === '/login' ||
    location.pathname === '/mixer-selection'

  const hideFooter =
    location.pathname === '/login'

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
      {!hideFooter && <Footer />}
    </>
  )
}

/* ---------------- App Component ---------------- */
function App() {
  // ⭐ GLOBAL MIXER STATE

  const [selectedMixer, setSelectedMixer] = useState(null)


  // ⭐ Sync mixer to Axios (one-time logic)
  useEffect(() => {
    setCurrentMixer(selectedMixer)
  }, [selectedMixer])


  const RequireMixer = ({ children }) => {
    if (!selectedMixer) {
      return <Navigate to="/mixer-selection" replace />;
    }
    return children;
  };


  return (
    // ⭐ PROVIDER WRAPS ENTIRE APP
    <MixerContext.Provider value={{ selectedMixer, setSelectedMixer }}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/test-mixer" element={<TestMixer />} />
            <Route path="/login" element={<Login />} />
            <Route path="/graph" element={<RequireMixer><GraphPage /></RequireMixer>}  />
            <Route path="/mixer-selection" element={<MixerSelection />} />


            <Route
              path="/"
              element={
                <RequireMixer>
                  <RecipePage />
                </RequireMixer>
              }
            />

            <Route
              path="/Material-management"
              element={
                <RequireMixer>
                  <MaterialManagement />
                </RequireMixer>
              }
            />

            <Route path="/add-edit-recipe" element={<RequireMixer><AddRecipe /></RequireMixer>} />
            <Route path="/delete-recipe" element={<RequireMixer><DeleteRecipe /></RequireMixer>} />
            <Route path="/copy-recipe" element={<RequireMixer><CopyRecipe /></RequireMixer>} />

            <Route path="/report" element={<Report />}>
              {/* Redirect /report to /report/weighing */}
              <Route index element={<Navigate to="weighing" replace />} />

              <Route path="weighing" element={<RequireMixer><WeighingReport /></RequireMixer>} />
              <Route path="batch" element={<RequireMixer><BatchReport /></RequireMixer>} />
              <Route path="summary" element={<RequireMixer><SummaryReport /></RequireMixer>} />
              <Route path="production" element={<RequireMixer><ProductionReport /></RequireMixer>} />
              <Route path="cleanout" element={<RequireMixer><CleanoutReport /></RequireMixer>} />
              <Route path="alarm" element={<AlarmReport />} />
              <Route path="operators-log" element={<RequireMixer><OperatorLog /></RequireMixer>} />
            </Route>

            <Route path="/oee-downtime" element={<Oee_Downtime />}>
              <Route index element={<Navigate to="downtime-Report" replace />} />
              <Route path="downtime-Report" element={<RequireMixer><DowntimeReport /></RequireMixer>} />
              <Route path="oee" element={<RequireMixer><Oee /></RequireMixer>} />
              <Route path="batch-hold" element={<RequireMixer><Batch_hold /></RequireMixer>} />
            </Route>

          </Routes>
        </Layout>
      </Router>
    </MixerContext.Provider>
  )
}

export default App
