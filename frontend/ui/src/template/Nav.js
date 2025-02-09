import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import '../index.css'

const Nav = () => {
  return (
    <nav>
        <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        </ul>
        <Outlet />
  </nav>
  )
}

export default Nav