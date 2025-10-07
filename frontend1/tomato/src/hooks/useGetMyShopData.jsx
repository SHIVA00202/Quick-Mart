import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice';
import { setMyShopData } from '../redux/ownerSlice';


function useGetMyShopData() {
    const dispatch=useDispatch();
    const {userData}=useSelector(state=>state.user);
  useEffect(()=>{
  const fetchShop=async () => {
    try {
           const result=await axios.get("http://localhost:8000/api/shop/get-my",{withCredentials:true})
            console.log(result)
            dispatch(setMyShopData(result.data))
  
    } catch (error) {
        console.log(error)
    }
}
fetchShop() 
  },[userData])
}

export default useGetMyShopData
