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
import Feedbacks from './pages/Feedbacks'
import Chat from './pages/Chat'
import Users from './pages/Users'
import Transactions from './pages/Transactions'
import Payment from './pages/Payment'
function App() {
  const loggedin = useSelector((state) => state.user.login)
  const [openNav, setOpenNav] = useState(false)
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
        <LeftNavigation
          openNav={openNav}
          setOpenNav={() => setOpenNav(false)}
        />
        <TopNav openNav={() => setOpenNav(true)} />
        <div onClick={() => setOpenNav(false)}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventories" element={<Inventories />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/feedbacks" element={<Feedbacks />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/users" element={<Users />} />
            <Route path="/payment" element={<Payment />} />
          </Routes>
        </div>
      </Router>
    </div>
  ) : loginn === false ? (
    <Login login={(v) => setLogin(v)} />
  ) : null
}

export default App
