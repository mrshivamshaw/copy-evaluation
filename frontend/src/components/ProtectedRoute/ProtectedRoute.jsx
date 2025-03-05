import React, { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Navigate, useLocation, useNavigate} from 'react-router-dom'
import { checkToken, logout } from '../../servies/operations/authOpertaion';
import toast from 'react-hot-toast';

const ProtectedRoute = ({children}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const {token} = useSelector((state) => state.auth);
  const {accountType} = useSelector((state) => state.profile);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      let validToken = await checkToken();
      if (!validToken) {
        dispatch(logout());
        toast.error('Please Login Again');
        navigate('/login');
      }
    };
    verifyToken();
  }, [dispatch, navigate]);
  if(token !== null && location.pathname.includes(accountType)){
    return children
  }
  return <Navigate to='/login'/>
}

export default ProtectedRoute