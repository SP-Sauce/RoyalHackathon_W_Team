import React, { useEffect, useState } from 'react'
import { IoMenu } from "react-icons/io5";
import { IconContext } from 'react-icons/lib';
import '../index.css'

const Meal = ({children, viewIngredients, name, setOrders, price, budget, orders, getTotalCost, recipe}) => {
  const [count, setCount] = useState(0)

  const inc = () => {
    if(calcTotalOrder() + price < budget)
      setCount(prevCount => prevCount + 1)
  }

  const dec = () => {
    setCount(prevCount => prevCount -1)
  }

  const calcTotalOrder = () => {
    let sum = 0;

    for (let i = 0; i < orders.length; i++) {
      sum += orders[i];
    }

    return sum;
  }

  useEffect(() => {
    if (!recipe || !recipe.servings || count === 0) return; 

    if (calcTotalOrder() + price < budget) {
        setOrders(prevOrders => [...prevOrders, (price * recipe.servings)]);
        console.log("Added order:", price * recipe.servings);
    }
    getTotalCost();
}, [count]); 


  

  return (
    <div 
        onClick={(event) => viewIngredients(event)}
        className='meal-list-updt'
        data-name={name}
    >
        <div>
            {children}
            <IconContext.Provider value={{size: '2em'}}>
                <IoMenu />
            </IconContext.Provider>
            <div className='buttons-and-count'>
              <button onClick={dec}>-</button>
              <p>{count}</p>
              <button onClick={inc}>+</button>
            </div>

        </div>
    </div>
  )
}

export default Meal