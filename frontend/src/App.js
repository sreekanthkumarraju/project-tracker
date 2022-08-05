import Login from "./Login/Login";
import Register from "./Register/Register";
import Dashboard from "./Dashboard/Dashboard";
import Project from "./Project/Project";
import axios from 'axios';
import SearchResultsPage from "./SearchResults/SearchResultsPage";
import "../node_modules/react-grid-layout/css/styles.css";
import "../node_modules/react-resizable/css/styles.css";
import Profile from "./Profile/Profile";
import UpdateProfile from "./Profile/UpdateProfile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Landing from "./LandingPage/Landing";
import UserContext from "./Context/UserContext";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";

import { useEffect, useState ,useContext} from "react";

function App() {
  let [loggedIn, setLoggedIn] = useState(false);
  const [isLoggedIn]=useContext(UserContext)
  const server= 'http://localhost:8080'

  
 
  //  useEffect(() => {
   
  //      async function fetchData() 
  //      {
  //        const result = await axios.get(`${server}/auth/isLoggedIn`) 
  //        console.log(result)
  //         const parsedResult = await result.data;
  //         console.log(parsedResult)
  //         setLoggedIn(parsedResult.isLoggedIn);
        
  //      }
  //      fetchData();
     
  //  });
  

  const logoutPressed = () => {
    setLoggedIn(false);
  };

  const loginPressed = () => {
    setLoggedIn(true);
  };

  return (
 
    <Router>
      <div aria-live="polite" aria-label="toast message">
        <ToastContainer role="alert" ariaLabel="toast" />
      </div>
      <Routes>
        <Route exact path="/register"  element={<Register />}>
       </Route>
       
        <Route exact path="/dashboard" element={
                      <Dashboard logoutPressed={logoutPressed}  isLo/>
        }>
          
        </Route>
        
        <Route exact path="/profile" element={  <Profile logoutPressed={logoutPressed} />}>
        </Route>
        
        <Route exact path="/profile/update" element={ <UpdateProfile logoutPressed={logoutPressed} />}>
        </Route>

        <Route exact path="/projects/:projectId" element={ <Project logoutPressed={logoutPressed} />}> 
        </Route>
        
        <Route exact path="/search/:query" element={<SearchResultsPage logoutPressed={logoutPressed} />}>   
        </Route>
        
        <Route exact path="/login" element=
          {!loggedIn ? (
            <Login loginPressed={loginPressed} loggedIn={loggedIn} />
          ) : (
            <Navigate to="/dashboard" replace={true} />
          )}>
        </Route>
        
        <Route exact path="/" element=
          {loggedIn ? <Navigate to='/dashboard'/> : <Landing />}>
        </Route>
     
      </Routes>
    </Router>
    
  );
}

export default App;