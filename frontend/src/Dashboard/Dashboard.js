import NavbarWSearch from "../Navbar/NavbarWSearch";
import ProjectCard from "./ProjectCard";
import { Link } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import * as Loader from "react-loader-spinner";
import Pagination from "@material-ui/lab/Pagination";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { toast } from "react-toastify";
import Footer from "../Footer/Footer.js";
import "./Dashboard.css";
import PropTypes from "prop-types";
import UserContext from "../Context/UserContext";
import 'bootstrap/dist/css/bootstrap.min.css';  
import {Modal, Button,FormGroup,FormLabel,Input, InputGroup} from 'react-bootstrap';  
//intialize the material ui styles with their hook
const useStyles = makeStyles((theme) => ({
  root: {
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

function Dashboard(props) {
  let loggedIn = useRef(null);
  let newProjectForm = useRef(null);
  let closeModalButton = useRef(null);
  const [userProjects, setProjectsData] = useState([]);
  const [projectCount, setProjectCount] = useState(0);
  const [sideBarProjects, setSideBarProjects] = useState([]);
  const [databaseQueried, setDataQueried] = useState(false);
  const [isLoggedIn,setLoggedIn,loggedUser,setLoggedUser]=useContext(UserContext)
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [show, setShow] = useState(false);  
  const modalClose = () => setShow(false);  
  const modalShow = () => setShow(true); 

  const [project,setProject]=useState({
    projectName:'',
    projectDescription:'' 
  })

  const server= 'http://localhost:8080'
  console.log(isDataLoading)


  const handleChange=(event)=>{
     const name=event.target.name
     const value=event.target.value

     setProject({...project,[name]:value})
  }

  useEffect(()=>{
    if(isLoggedIn)
    {
      setIsDataLoading(true)
    }
  },[])
   
  // pagination handling
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const handlePaginationChange = (event, value) => {
    setProjectsData([]);
    setIsDataLoading(true);
    setPage(value);
  };

  // function for handling the submission of a new project
  const newProjectSubmit = async (event) => {

    console.log(project)
    // event.preventDefault();
    //  var formData = new FormData(newProjectForm.current);
    // //  const projectName = formData.get("projectName");
    // //  const projectDescription = formData.get("projectDescription");
     const result = await fetch(`${server}/projects`, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
         projectName:project.projectName,
         projectDescription:project.projectDescription,
         ownerId: loggedUser._id,
       }),
     });
     console.log(result)
     if (result) {
      //  closeModalButton.current.click();
       toast.dark("Successfully added a new project!");
       console.log(page,'page')
       const dataResult = await fetch(
         `/projects/${loggedUser._id}/page/${page}`,
         {
           method: "GET",
         }
       );
       console.log(dataResult)
       const parsedProjectsData = await dataResult.json();
       console.log(parsedProjectsData)
       setProjectsData(parsedProjectsData);
     } else {
       toast.error("Couldn't create the new project. Please try again!");
     }
  };

  //  this use effects will generate the project count to know how many pages the dashboard should have
  useEffect(() => {
    // get the user's project count to implement pagination
    async function fetchProjectCount() {
      if (loggedUser && loggedUser._id) {
        const projectCountResult = await fetch(
          `${server}/projects/${loggedUser._id}/count`,
          {
            method: "GET",
          }
        );
        const parsedProjectsData = await projectCountResult.json();
        setProjectCount(parsedProjectsData.count);
        setIsDataLoading(false);
      }
    }
    fetchProjectCount();
  }, [loggedUser]);

  // use effect that pulls projects based on the page that is selected
  useEffect(() => {
    async function fetchProjectData() {
      if (loggedUser && loggedUser._id) {
        const dataResult = await fetch(
          `${server}/projects/${loggedUser._id}/page/${page}`,
          {
            method: "GET",
          }
        );
        const parsedProjectsData = await dataResult.json();
        setProjectsData(parsedProjectsData);
        setIsDataLoading(false);
        setDataQueried(true);
      }
    }
    fetchProjectData();
  }, [loggedUser, page,project]);

  // use effect that pulls the 5 most recently created projects for the user if they exist
  useEffect(() => {
    async function getRecentProjects() {
      if (loggedUser && loggedUser._id) {
        // we are reusing the profile projects card because it also generates the most recent 5 projects.
        const rawData = await fetch(`${server}/projects/${loggedUser._id}/profile`);
        const parsedRecentProjects = await rawData.json();
        setSideBarProjects(parsedRecentProjects);
      }
    }
    getRecentProjects();
  }, [loggedUser,project]);

  // this handles the logoutbutton pressing and we call the props.logoutpressed too to let the main App component know the state has changed.
  const logoutPressed = () => {
    setLoggedIn(false);
    setLoggedUser(null);
    props.logoutPressed();
  };

  // if the user is logged in and we have access to the user object, we will render the normal dashboard view, if not, we will redirect them.
  if (isLoggedIn && loggedUser) {
    return (
      <div>
        <NavbarWSearch logoutPressed={logoutPressed} />
        <div className="container-fluid">
          <div className="row">
            <nav
              id="sidebarMenu"
              className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
            >
              <div className="position-sticky pt-3">
                <ul className="nav flex-column">
                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      aria-current="page"
                      to="/dashboard"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-home"
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                      Dashboard
                    </Link>
                  </li>
                  
                  <li className="nav-item">
                    <Link className="nav-link" to="/profile">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-users"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      Profile
                    </Link>
                  </li>
                  
                  <li className="nav-item">

                  <Button variant="success" onClick={modalShow}>  
                      create New Project
                  </Button>    
                    
                  </li>
                </ul>
                
                <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1">
                  <span>Recent Projects</span>
                </h6>
                <ul className="nav flex-column mb-2">
                  {
                    sideBarProjects.map((project) => {
                      return (
                        <li key={project._id}>
                          <Link
                            key={project._id}
                            className="projectLink nav-link"
                            to={"/projects/" + project._id}
                          >
                            {project.projectName}
                          </Link>
                        </li>
                      );
                    })}
                </ul>
                {userProjects.length === 0 && (
                  <div className="container">No Projects Yet!</div>
                )}
              </div>
            </nav>
            {/* start of new project modal setup */}
            
          <Modal show={show} onHide={modalClose}>  
              
              <Modal.Header closeButton>  
                   <Modal.Title>Project</Modal.Title>  
              </Modal.Header>  
  
            <Modal.Body>  
     
              <FormGroup   id="newProjectForm" ref={newProjectForm}>
              
                 <FormLabel htmlFor="projectName">Project Name</FormLabel>
               
                <InputGroup>
             
                   <input type="text"
                      className="form-control"
                      id="projectName"
                      name="projectName"
                      required
                      aria-describedby="basic-addon2"
                      onChange={handleChange}
                    />
             
                </InputGroup>
              </FormGroup>
        
              <FormGroup>
                 <FormLabel  htmlFor="projectDescription">Project Description</FormLabel>
            
                 <InputGroup>
                    <textarea
                          className="form-control"
                          id="projectDescription"
                          name="projectDescription"
                          required
                          onChange={handleChange}
                     ></textarea>
                  </InputGroup>           
              </FormGroup>
            </Modal.Body>  
  
          <Modal.Footer>  
            <Button variant="secondary" onClick={modalClose}>
               Close
            </Button>
            
            <Button variant="primary" onClick={()=>{         
               newProjectSubmit()
               modalClose()
            }}>
                Save Changes
           </Button>
          </Modal.Footer>  
     </Modal>  

           

            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
              <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2 dashTitle">Dashboard</h1>
              </div>
              <div className="row row-cols-1 row-cols-md-2 g-4">
                  {/* <div className="container">
                    <Loader
                      type="Puff"
                      color="#005252"
                      height={500}
                      width={500}
                    />
                  </div> */}
                
                {userProjects.map((project) => {
                  return (
                    <Link
                      key={project._id}
                      className="projectLink"
                      to={"/projects/" + project._id}
                    >
                      <ProjectCard
                        key={project._id}
                        name={project.projectName}
                        description={project.projectDescription}
                      />
                    </Link>
                  );
                })}

                {
                  databaseQueried &&
                  userProjects.length === 0 && (
                    <div>
                      <h3>No Projects Yet!</h3>
                    </div>
                  )}
              </div>
              <div className="d-flex justify-content-center mt-3">
                <div className={classes.root}>
                  <Typography align="center">Page: {page}</Typography>
                  <Pagination
                    count={Math.floor(projectCount / 14) + 1}
                    page={page}
                    onChange={handlePaginationChange}
                  />
                </div>
              </div>
              <Footer />
            </main>
          </div>
        </div>
      </div>
    );
  } 
  else {
 
     return <Navigate to="/login" />;
   }
}

Dashboard.propTypes = {
  logoutPressed: PropTypes.func.isRequired,
};

export default Dashboard;