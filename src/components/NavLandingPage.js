import React, { Component } from "react";
import { Navbar, Button } from "react-bootstrap";

export class NavLandingPage extends Component {
  constructor() {
    super();
    this.state = {
      showSettings: false,
    };
  }

  render() {
    return (
      <Navbar id="nav">
        <Navbar.Brand id="navlogo" href="/">
          MEMESSENGER
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Button size="lg" variant="primary" onClick={() => this.props.login()}>
            Login
          </Button>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavLandingPage;
