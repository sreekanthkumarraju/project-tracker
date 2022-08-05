import React, { useEffect, useState } from "react";
import UserContext from "./UserContext";

export default function UseStates(props){
      
     const [isLoggedIn,setLoggedIn]=useState(false)
     const [loggedUser,setLoggedUser]=useState(undefined)

    
     
   

     console.log(isLoggedIn,loggedUser)
      
    return(
        <UserContext.Provider value={[isLoggedIn,setLoggedIn,loggedUser,setLoggedUser]}>

            {props.children}  
            
        </UserContext.Provider>
    )
}