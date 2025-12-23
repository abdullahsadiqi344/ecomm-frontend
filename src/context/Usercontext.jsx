import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthDataContext } from './authContext.jsx'
import axios from 'axios'

export const userdatacontext = createContext()

const Usercontext = ({ children }) => {
  let [userdata, setuserdata] = useState(null)
  let [loading, setLoading] = useState(true)
  let { serverUrl } = useContext(AuthDataContext)

  const getcurrentuser = async () => {
    try {
      console.log("Fetching user from:", `${serverUrl}/api/user/getcurrentuser`)
      
      // CHANGE FROM POST TO GET
      let result = await axios.get(
        serverUrl + "/api/user/getcurrentuser",
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      
      console.log("User data received:", result.data)
      
      if (result.data) {
        setuserdata(result.data)
        localStorage.setItem('user', JSON.stringify(result.data))
      }
    } catch (error) {
      console.log("Error getting user:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      setuserdata(null)
      localStorage.removeItem('user')
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await axios.post(
        serverUrl + "/api/auth/logout",
        {},
        { withCredentials: true }
      )
    } catch (error) {
      console.log("Logout error:", error.message)
    }
    
    setuserdata(null)
    localStorage.removeItem('user')
    window.location.reload()
  }

  useEffect(() => {
    getcurrentuser()
  }, [])

  let value = {
    userdata,
    setuserdata,
    getcurrentuser,
    logout,
    loading,
    isAuthenticated: !!userdata
  }

  return (
    <div>
      <userdatacontext.Provider value={value}>
        {children}
      </userdatacontext.Provider>
    </div>
  )
}

export default Usercontext