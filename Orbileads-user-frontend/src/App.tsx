import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import GoogleAuthCallbackPage from './pages/GoogleAuthCallbackPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import SignupPage from './pages/SignupPage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--color-app)] text-slate-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/google/callback" element={<GoogleAuthCallbackPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
