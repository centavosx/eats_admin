import logo from './logo.svg'
import './App.css'
import { Link, Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import { LeftNavigation } from './components/Navigation'
import { TopNav } from './components/Navigation'
import { useSelector, useDispatch } from 'react-redux'
import Dashboard from './pages/Dashboard'
import React, { useState } from 'react'
import Login from './pages/Login'
import Inventories from './pages/Inventory'
import Chat from './pages/Chat'
function App() {
  const loggedin = useSelector((state) => state.user.login)
  const [loginn, setLogin] = useState(null)
  React.useEffect(() => {
    const fetchData = async () => {
      setLogin(await loggedin)
    }
    fetchData()
  }, [loggedin])
  return loginn ? (
    <div class="wrapper ">
      <Router>
        <LeftNavigation />
        <TopNav />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventories" element={<Inventories />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Router>
    </div>
  ) : loginn === false ? (
    <Login login={(v) => setLogin(v)} />
  ) : null
}

export default App
