import axios from 'axios'
import React, { useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import socket from '../socket'
import './style.css'
export const LeftNavigation = (props) => {
  const [num, setNum] = useState(0)

  const location = useLocation()
  React.useEffect(() => {
    getUnreadNum()
    socket.on('totalUnread', (data) => {
      setNum(data)
    })
  }, [])
  const getUnreadNum = async () => {
    const resp = await axios.get(process.env.REACT_APP_API)
    setNum(resp.data.data)
  }
  return (
    <div
      className={props.openNav ? 'left sidebar' : 'sidebar'}
      data-color="black"
      data-active-color="success"
    >
      <div className="logo">
        <a
          href="http://eats-onlineph.herokuapp.com"
          className="simple-text logo-mini"
        >
          <div className="logo-image-small">
            <img src="./assets/eatsonlinelogo.png" />
          </div>
        </a>
        <a
          href="http://eats-onlineph.herokuapp.com"
          className="simple-text logo-normal"
        >
          EATS ONLINE ADMIN
        </a>
      </div>
      <div className="sidebar-wrapper">
        <ul className="nav">
          <li className={location.pathname == '/' ? 'active' : ''}>
            <Link to="/" onClick={() => props.setOpenNav()}>
              <i className="nc-icon nc-bank"></i>
              <p>Dashboard</p>
            </Link>
          </li>
          <li className={location.pathname == '/payment' ? 'active' : ''}>
            <Link to="/payment" onClick={() => props.setOpenNav()}>
              <i className="nc-icon nc-credit-card"></i>
              <p>Payment</p>
            </Link>
          </li>
          <li className={location.pathname == '/users' ? 'active' : ''}>
            <Link to="/users" onClick={() => props.setOpenNav()}>
              <i className="nc-icon nc-single-02"></i>
              <p>Users</p>
            </Link>
          </li>
          <li className={location.pathname == '/feedbacks' ? 'active' : ''}>
            <Link to="/feedbacks" onClick={() => props.setOpenNav()}>
              <i className="nc-icon nc-email-85"></i>
              <p>Feedbacks</p>
            </Link>
          </li>
          <li className={location.pathname == '/chat' ? 'active' : ''}>
            <Link to="/chat" onClick={() => props.setOpenNav()}>
              <i className="nc-icon nc-chat-33"></i>
              <p>
                Chat <b style={{ color: 'red' }}>{num > 0 ? num : null}</b>
              </p>
            </Link>
          </li>
          <li className={location.pathname == '/orders' ? 'active' : ''}>
            <Link to="/transactions" onClick={() => props.setOpenNav()}>
              <i className="nc-icon nc-single-copy-04"></i>
              <p>Transactions</p>
            </Link>
          </li>
          <li className={location.pathname == '/inventories' ? 'active' : ''}>
            <Link to="/inventories" onClick={() => props.setOpenNav()}>
              <i className="nc-icon nc-app"></i>
              <p>Inventories</p>
            </Link>
          </li>
          <li className="active-pro">
            <a
              href={void 0}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                localStorage.removeItem('user')
                localStorage.removeItem('pass')
                window.location.reload(false)
              }}
            >
              <i className="nc-icon nc-button-power"></i>
              <p>Logout</p>
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export const TopNav = (props) => {
  const [notif, setNotif] = useState([])
  React.useEffect(() => {
    getCritical()
    socket.on('criticalproducts', (data) => {
      setNotif(data)
    })
  }, [])
  const getCritical = async () => {
    const resp = await axios.get(
      process.env.REACT_APP_API + 'getCriticalProducts'
    )
    setNotif(resp.data)
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-absolute fixed-top navbar-transparent">
      <div className="container-fluid">
        <div className="navbar-wrapper">
          <div className="navbar-toggle">
            <button
              type="button"
              className="navbar-toggler"
              onClick={() => props.openNav()}
            >
              <span className="navbar-toggler-bar bar1"></span>
              <span className="navbar-toggler-bar bar2"></span>
              <span className="navbar-toggler-bar bar3"></span>
            </button>
          </div>
          <a className="navbar-brand">EATS ONLINE</a>
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navigation"
          aria-controls="navigation-index"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-bar navbar-kebab"></span>
          <span className="navbar-toggler-bar navbar-kebab"></span>
          <span className="navbar-toggler-bar navbar-kebab"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navigation"
        >
          <ul className="navbar-nav">
            <li className="nav-item btn-rotate dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="http://example.com"
                id="navbarDropdownMenuLink"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="nc-icon nc-bell-55"></i>
                <span style={{ marginRight: '5px', color: 'red' }}>
                  {' '}
                  {notif.length > 0 ? notif.length : null}
                </span>
                <p>
                  <span className="d-lg-none d-md-block">Notifications</span>
                </p>
              </a>
              <div
                className="dropdown-menu dropdown-menu-right"
                aria-labelledby="navbarDropdownMenuLink"
              >
                {notif.map((data) => (
                  <a className="dropdown-item" href="#">
                    {data.title} {data.numberofitems} items left
                  </a>
                ))}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
