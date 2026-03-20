import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom"
import ProtectedRoute from './components/ProtectedRoute'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'

const App = () =>(
  <BrowserRouter>
  <Routes>
    <Route exact path='/login' element={<Login/>}/>
    <Route exact path='/register' element={<Register/>}/>
    <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
    </Route>
    <Route path="/" element={<Navigate to="/login" replace />} />
  </Routes>
  </BrowserRouter>
)
export default App
