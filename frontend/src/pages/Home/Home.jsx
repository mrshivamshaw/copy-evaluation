import React from 'react'
import { useDispatch } from 'react-redux'
import { logout } from '../../servies/operations/authOpertaion'

const Home = () => {
  const dispatch = useDispatch()
  const logoutHandler = () =>{
    dispatch(logout())
  }
  return (
    <div className='w-[100vw] h-[100vh] overflow-x-hidden box-border relative z-10 bg-blue-bg '>
            hiii
            <button onClick={logoutHandler}>logout</button>
    </div>
  )
}

export default Home