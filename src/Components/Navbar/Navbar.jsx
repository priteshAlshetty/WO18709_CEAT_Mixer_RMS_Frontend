// // import React, { useState, createContext } from 'react'
// // import { NavLink } from 'react-router-dom'
// // import './Navbar.css'
// // import ceatlogo from '../../images/logo1.jpg'

// // export const MixerContext = createContext()

// // const Navbar = () => {
// //   const [selectedMixer, setSelectedMixer] = useState('Mixer 1')

// //   return (
// //     <MixerContext.Provider value={{ selectedMixer, setSelectedMixer }}>
// //       <div className="Navbar">
// //         <div className="left-section">
// //           <div className="logo">
// //             <img src={ceatlogo} alt="logo" />
// //           </div>
// //           <div className="Mixer-selection">Mixer Selection
// //             <select
// //               value={selectedMixer}
// //               onChange={(e) => setSelectedMixer(e.target.value)}
// //               className="mixer-dropdown"
// //             >
// //               <option value="Mixer 1">Mixer 1</option>
// //               <option value="Mixer 2">Mixer 2</option>
// //               <option value="Mixer 3">Mixer 3</option>
// //             </select>
// //           </div>
// //         </div>

// //         <div className="link">
// //           <ul>
// //             <li>
// //               <NavLink
// //                 to="/"
// //                 className={({ isActive }) => (isActive ? 'active-link' : '')}
// //               >
// //                 Recipe Management
// //               </NavLink>
// //             </li>
// //             <li>
// //               <NavLink
// //                 to="/material-management"
// //                 className={({ isActive }) => (isActive ? 'active-link' : '')}
// //               >
// //                 Material Management
// //               </NavLink>
// //             </li>
// //             <li>
// //               <NavLink
// //                 to="/report"
// //                 className={({ isActive }) => (isActive ? 'active-link' : '')}
// //               >
// //                 Report
// //               </NavLink>
// //             </li>
// //             <li>
// //               <NavLink
// //                 to="/oee-downtime"
// //                 className={({ isActive }) => (isActive ? 'active-link' : '')}
// //               >
// //                 OEE & Downtime
// //               </NavLink>
// //             </li>
// //           </ul>
// //         </div>
// //       </div>
// //     </MixerContext.Provider>
// //   )
// // }

// // export default Navbar

// import React, { useContext } from 'react'
// import { NavLink } from 'react-router-dom'
// import './Navbar.css'
// import ceatlogo from '../../images/logo1.jpg'
// import { MixerContext } from '../../context/MixerContext'

// const Navbar = () => {
//   const { selectedMixer, setSelectedMixer } = useContext(MixerContext)

//   return (
//     <div className="Navbar">
//       <div className="left-section">
//         <div className="logo">
//           <img src={ceatlogo} alt="logo" />
//         </div>

//         <div className="Mixer-selection">
//           Mixer Selection
//           <select
//             value={selectedMixer}
//             onChange={(e) => setSelectedMixer(e.target.value)}
//             className="mixer-dropdown"
//           >
//             <option value="Mixer 1">Mixer 1</option>
//             <option value="Mixer 2">Mixer 2</option>
//             <option value="Mixer 3">Mixer 3</option>
//           </select>
//         </div>
//       </div>

//       <div className="link">
//         <ul>
//           <li>
//             <NavLink to="/" className={({ isActive }) => isActive ? 'active-link' : ''}>
//               Recipe Management
//             </NavLink>
//           </li>
//           <li>
//             <NavLink to="/material-management" className={({ isActive }) => isActive ? 'active-link' : ''}>
//               Material Management
//             </NavLink>
//           </li>
//           <li>
//             <NavLink to="/report" className={({ isActive }) => isActive ? 'active-link' : ''}>
//               Report
//             </NavLink>
//           </li>
//           <li>
//             <NavLink to="/graph" className={({ isActive }) => isActive ? 'active-link' : ''}>
//               Graph
//             </NavLink>
//           </li>
//           <li>
//             <NavLink to="/oee-downtime" className={({ isActive }) => isActive ? 'active-link' : ''}>
//               OEE & Downtime
//             </NavLink>
//           </li>
//         </ul>
//       </div>
//     </div>
//   )
// }

// export default Navbar


import React, { useContext } from 'react'
// import { NavLink } from 'react-router-dom'
import { NavLink, useNavigate } from 'react-router-dom'

import './Navbar.css'
import ceatlogo from '../../images/logo1.jpg'
import { MixerContext } from '../../context/MixerContext'
import ProfileMenu from '../Login_info/Login_info'

const Navbar = () => {
  const { selectedMixer, setSelectedMixer } = useContext(MixerContext)

  const user = {
    name: "Multiquadrant",
    role: "Admin"
  }

  const handleLogout = () => {
    console.log("Logout clicked")
  }

  const handleAdmin = () => {
    console.log("Admin clicked")
  }
const navigate = useNavigate();

  return (
    <div className="Navbar">
      <div className="left-section">
        <div className="logo">
          <img src={ceatlogo} alt="logo" />
        </div>

        <div className="Mixer-selection">
          
          {/* <select
            value={selectedMixer}
            onChange={(e) => setSelectedMixer(e.target.value)}
            className="mixer-dropdown"
          >
            <option value="Mixer 1">Mixer 1</option>
            <option value="Mixer 2">Mixer 2</option>
            <option value="Mixer 3">Mixer 3</option>
          </select> */}

         <div
  className="Mixer-selection mixer-clickable"
  onClick={() => navigate("/mixer-selection")}
>
 Selected Mixer:
  <span style={{ marginLeft: "6px", fontWeight: 600 }}>
    {selectedMixer || "Select"}
  </span>
</div>

        </div>
      </div>

      <div className="link">
        <ul>
          <li><NavLink to="/" className={({ isActive }) => isActive ? 'active-link' : ''}>Recipe Management</NavLink></li>
          <li><NavLink to="/material-management" className={({ isActive }) => isActive ? 'active-link' : ''}>Material Management</NavLink></li>
          <li><NavLink to="/report" className={({ isActive }) => isActive ? 'active-link' : ''}>Report</NavLink></li>
          <li><NavLink to="/graph" className={({ isActive }) => isActive ? 'active-link' : ''}>Graph</NavLink></li>
          <li><NavLink to="/oee-downtime" className={({ isActive }) => isActive ? 'active-link' : ''}>OEE & Downtime</NavLink></li>
        </ul>
      </div>

      {/* RIGHT END PROFILE */}
      <ProfileMenu
        user={user}
        onLogout={handleLogout}
        onAdmin={handleAdmin}
      />
    </div>
  )
}

export default Navbar
