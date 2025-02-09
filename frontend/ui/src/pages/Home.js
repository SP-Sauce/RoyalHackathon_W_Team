import React from 'react'
import './index.css'
import { Link } from 'react-router-dom';

const Home = () => {
  return (
   
      <div className='bg center-container'>
        <img src='/logo.png' alt='/public/logo.png' width='700rem' />
        <div className='input-container'>
          <button type='text'  className='rounded-input'><Link to='ai-chat'>Kickstart your meal plan now</Link></button>
        </div>
      </div>
    

  )
}

export default Home