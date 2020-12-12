import React, { Component, Suspense } from "react";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Loading from "./Loading";
import { BrowserView, MobileView } from "react-device-detect";
const AccSettings = React.lazy(() => import("./AccSettingsModal"));

export class Nav extends Component {
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
          {/* komputer */}
          <BrowserView>
            <Button
              onClick={this.props.logout}
              style={{ marginRight: "20px" }}
              variant="primary"
            >
              Logout
            </Button>
            <Navbar.Text style={{ color: "white" }}>
              Signed in as: {this.props.username}
            </Navbar.Text>
            <Button
              onClick={() => {
                this.setState({ showSettings: true });
              }}
              id="accbtn"
              variant="outline-secondary"
            >
              <ion-icon id="account" name="ellipsis-vertical-circle"></ion-icon>
            </Button>
          </BrowserView>

          {/* telefon */}
          <MobileView>
            <Button
              id="accbtn"
              variant="outline-secondary"
              onClick={this.props.sidebar}
            >
              <ion-icon id="account" name="menu-outline"></ion-icon>
            </Button>
          </MobileView>
        </Navbar.Collapse>
        <Suspense fallback={<Loading />}>
          <AccSettings //komponent z ustawieniami konta
            show={this.state.showSettings}
            onHide={() => {
              this.setState({ showSettings: false });
            }}
          />
        </Suspense>
      </Navbar>
    );
  }
}

export default Nav;
