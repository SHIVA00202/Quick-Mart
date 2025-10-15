import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice';


function useGetCurrentUser() {
    const dispatch=useDispatch();
  useEffect(()=>{
  const fetchUser=async () => {
    try {
           const result=await axios.get("http://localhost:8000/api/user/current",{withCredentials:true})
            console.log(result)
            dispatch(setUserData(result.data))
  
    } catch (error) {
        console.log(error)
    }
}
fetchUser()
 
  },[])
}

export default useGetCurrentUser
