import React, { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Logo from "../../images/logo.png"
import { NavLink } from 'react-router-dom'
import { routesArrayForHeader } from "../../routing/RoutingPaths"
import UseFormContext from "../../context/UseFormContext";
import { useLocation } from "react-router";

function Header() {
  const formContext = UseFormContext();
  const location = useLocation()
  const [pathName, setpathName] = useState();


  useEffect(() => {
    setpathName(location?.pathname)
  }, [location]);

  return (
    <Navbar expand="lg" className="bg-body-tertiary header-wrap">
      <Container fluid>
        <Navbar.Brand ><img src={Logo} alt="" /></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <div className="pages-tab">
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {routesArrayForHeader?.map(data => {
                return <NavLink className={`nav-text ${(formContext.carbikeformikValues?.formtype === data?.type &&( pathName === "/quotes"||pathName === "/proposal"||pathName === "/quotes/1"  )) ? "active" : ""}`} to={data.path} key={data.heading}>{data.heading}</NavLink>
              })}
            </Nav>
          </Navbar.Collapse>
        </div>
      </Container>
    </Navbar>
  );
}

export default Header;





