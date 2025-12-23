import React from 'react'
import { createContext } from 'react'


export const AuthDataContext=createContext()



const AuthContext = ( {children}) => {

   //const serverUrl = import.meta.env.VITE_BACKEND_URL  
   const serverUrl =  "http://localhost:60001"
    let value={
        serverUrl,
    }
    return (
        <div>
            <AuthDataContext.Provider  value={value}>
                {children}
            </AuthDataContext.Provider>
        </div>
    )
}

export default AuthContext
