import React, { useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export const LeftNavigation = (props) => {
  const location = useLocation()
  return (
    <div className="sidebar" data-color="black" data-active-color="success">
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
            <Link to="/">
              <i className="nc-icon nc-bank"></i>
              <p>Dashboard</p>
            </Link>
          </li>
          <li className={location.pathname == '/users' ? 'active' : ''}>
            <Link to="/users">
              <i className="nc-icon nc-diamond"></i>
              <p>Users</p>
            </Link>
          </li>
          <li className={location.pathname == '/feedbacks' ? 'active' : ''}>
            <Link to="/feedbacks">
              <i className="nc-icon nc-pin-3"></i>
              <p>Feedbacks</p>
            </Link>
          </li>
          <li className={location.pathname == '/chat' ? 'active' : ''}>
            <Link to="/chat">
              <i className="nc-icon nc-bell-55"></i>
              <p>Chat</p>
            </Link>
          </li>
          <li className={location.pathname == '/orders' ? 'active' : ''}>
            <Link to="/orders">
              <i className="nc-icon nc-single-02"></i>
              <p>Orders</p>
            </Link>
          </li>
          <li className={location.pathname == '/advance' ? 'active' : ''}>
            <Link to="/advance">
              <i className="nc-icon nc-tile-56"></i>
              <p>Advance Orders</p>
            </Link>
          </li>
          <li className={location.pathname == '/inventories' ? 'active' : ''}>
            <Link to="/inventories">
              <i className="nc-icon nc-caps-small"></i>
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

export const TopNav = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-absolute fixed-top navbar-transparent">
      <div className="container-fluid">
        <div className="navbar-wrapper">
          <div className="navbar-toggle">
            <button type="button" className="navbar-toggler">
              <span className="navbar-toggler-bar bar1"></span>
              <span className="navbar-toggler-bar bar2"></span>
              <span className="navbar-toggler-bar bar3"></span>
            </button>
          </div>
          <a className="navbar-brand" href="javascript:;">
            Paper Dashboard 2
          </a>
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
          <form>
            <div className="input-group no-border">
              <input
                type="text"
                value=""
                className="form-control"
                placeholder="Search..."
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <i className="nc-icon nc-zoom-split"></i>
                </div>
              </div>
            </div>
          </form>
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link btn-magnify" href="javascript:;">
                <i className="nc-icon nc-layout-11"></i>
                <p>
                  <span className="d-lg-none d-md-block">Stats</span>
                </p>
              </a>
            </li>
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
                <p>
                  <span className="d-lg-none d-md-block">Some Actions</span>
                </p>
              </a>
              <div
                className="dropdown-menu dropdown-menu-right"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <a className="dropdown-item" href="#">
                  Action
                </a>
                <a className="dropdown-item" href="#">
                  Another action
                </a>
                <a className="dropdown-item" href="#">
                  Something else here
                </a>
              </div>
            </li>
            <li className="nav-item">
              <a className="nav-link btn-rotate" href="javascript:;">
                <i className="nc-icon nc-settings-gear-65"></i>
                <p>
                  <span className="d-lg-none d-md-block">Account</span>
                </p>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
