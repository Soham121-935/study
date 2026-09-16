import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import ZeroPage from './pages/ZeroPage.jsx'
import StructurePage from './pages/StructurePage.jsx'
import Q1 from './pages/Q1.jsx'
import Q2 from './pages/Q2.jsx'
import Q3 from './pages/Q3.jsx'
import Q4 from './pages/Q4.jsx'
import Q5 from './pages/Q5.jsx'
import Q6 from './pages/Q6.jsx'
import Q7 from './pages/Q7.jsx'
import Q8 from './pages/Q8.jsx'
import Q9 from './pages/Q9.jsx'
import Q10 from './pages/Q10.jsx'
import Revision from './pages/Revision.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/zero" element={<ZeroPage />} />
        <Route path="/structure" element={<StructurePage />} />
        <Route path="/q1" element={<Q1 />} />
        <Route path="/q2" element={<Q2 />} />
        <Route path="/q3" element={<Q3 />} />
        <Route path="/q4" element={<Q4 />} />
        <Route path="/q5" element={<Q5 />} />
        <Route path="/q6" element={<Q6 />} />
        <Route path="/q7" element={<Q7 />} />
        <Route path="/q8" element={<Q8 />} />
        <Route path="/q9" element={<Q9 />} />
        <Route path="/q10" element={<Q10 />} />
        <Route path="/revision" element={<Revision />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}
