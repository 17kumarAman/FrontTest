import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/Login'
import Contact from './pages/Contact '
import Navbar from './Navbar'
import AdminDashboard from './pages/AdminDashBoard'
import ProtectedRoute from './components/ProtectedRoute'

import { Routes, Route, Navigate } from "react-router-dom";
import Enquiries from './pages/Enquiries'

// import { Routes, Route } from "react-router-dom";
function App() {

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/contact-us" replace />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/enquiries"
            element={
              <ProtectedRoute>
                <Enquiries />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/contact-us" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
