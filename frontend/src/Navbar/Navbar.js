import "./Navbar.css";
import { useState } from "react";
import {  Link } from "react-router-dom";
import NavLogo from "../Images/NavLogo.png";
import PropTypes from "prop-types";

function Navbar(props) {
  
  const [loggedIn, setLoggedIn] = useState(true);

  const server= 'http://localhost:8080'

  const handleSignOut = async () => {
    const response = await fetch(`${server}/auth/logout`, { method: "GET" });
    const parsedResponse = await response.json();
    if (parsedResponse.logout) {
      setLoggedIn(false);
      props.logoutPressed();
    }
  };

  if (loggedIn) {
    return (
      <header className="navbar navbar-light sticky-top nav-bg flex-md-nowrap p-0 shadow">
        <Link className="col-md-3 col-lg-2 me-0 px-3 optask-brand-text" to="/">
          <img
            src={NavLogo}
            alt="OpTask Logo"
            className="me-1"
            style={{ width: "35px", height: "35px" }}
          />
          OpTask
        </Link>
        <button
          className="navbar-toggler position-absolute d-md-none collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#sidebarMenu"
          aria-controls="sidebarMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap">
            <button className="btn nav-bar-sign-out" onClick={handleSignOut}>
              Sign out
            </button>
          </li>
        </ul>
      </header>
    );
  } else {
    return window.open('/login');
  }
}

Navbar.propTypes = {
  logoutPressed: PropTypes.func.isRequired,
};

export default Navbar;