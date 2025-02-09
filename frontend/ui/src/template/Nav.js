import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import './nav.css'

const Nav = () => {
  return (
    <div>
        <nav>
            <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            </ul>
      </nav>
      <Outlet />
    </div>
  )
}

export default Nav