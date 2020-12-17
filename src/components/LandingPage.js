import React, { Component } from "react";
import { Button, Row, Col, Navbar } from "react-bootstrap";
import Particles from "react-particles-js";
import LoginModal from "./LoginModal";
import NavLandingPage from "./NavLandingPage";
import Slide from "react-reveal/Slide";
import { BrowserView, MobileView, isMobile } from "react-device-detect";

export class LandingPage extends Component {
  constructor() {
    super();
    this.state = {
      modalShow: false,
    };
  }
  font() {
    if (isMobile) {
      return "3rem";
    } else {
      return "3.5rem";
    }
  }
  render() {
    return (
      <div>
        <Particles
          params={{
            particles: {
              number: {
                value: 80,
                density: {
                  enable: true,
                  value_area: 800,
                },
              },
            },
          }}
          style={{ position: "fixed" }}
          height={window.innerHeight - 6}
          width={window.innerWidth - 6}
        />
        <NavLandingPage login={() => this.setState({ modalShow: true })} />
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
          <Row style={{ width: "80vw", color: "white", marginTop: "3rem" }}>
            <Col md="4" style={{ textAlign: "center", margin: "auto" }}>
              <h1 style={{ fontWeight: "300", fontSize: this.font(), padding: "1rem" }}>Memessenger, best place to send memes to your friends or communities.</h1>
              <Button style={{ padding: "10px", fontSize: "1.5rem" }} block variant="primary" onClick={() => this.setState({ modalShow: true })}>
                Join Now
              </Button>
            </Col>
            <Col md="8" style={{ textAlign: "center" }}>
              <BrowserView>
                <img alt="messaging" style={{ height: "90vh" }} src="./mess.jpg"></img>
              </BrowserView>
              <MobileView>
                <img alt="messaging" style={{ width: "90%" }} src="./mess.jpg"></img>
              </MobileView>
            </Col>
          </Row>
          <Slide duration="500" distance="50px" bottom>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Row style={{ width: "80vw", color: "white", marginTop: "3rem" }}>
                <Col md="4" style={{ textAlign: "center", margin: "auto" }}>
                  <h1 style={{ fontWeight: "300", fontSize: this.font() }}>Create rooms for diffrent topics or diffrent communities</h1>
                </Col>
                <Col md="8" style={{ textAlign: "center" }}>
                  <img alt="rooms" style={{ height: "50vh" }} src="./rooms.jpg"></img>
                </Col>
              </Row>
            </div>
          </Slide>
          <Slide duration="500" distance="50px" bottom>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Row style={{ width: "80vw", color: "white", marginTop: "3rem" }}>
                <Col md="4" style={{ textAlign: "center", margin: "auto" }}>
                  <h1 style={{ fontWeight: "300", fontSize: this.font() }}>Share the rooms to anyone easily with one simple code</h1>
                </Col>
                <Col md="8" style={{ textAlign: "center" }}>
                  <BrowserView>
                    <img alt="messaging" style={{ height: "30vh" }} src="./sharing.jpg"></img>
                  </BrowserView>
                  <MobileView>
                    <img alt="messaging" style={{ width: "100%" }} src="./sharing.jpg"></img>
                  </MobileView>
                </Col>
              </Row>
            </div>
          </Slide>
        </div>
        <Navbar sticky="bottom" id="nav" style={{ justifyContent: "center", padding: "1rem", marginTop: "3rem" }}>
          <h6>Copyright Mateusz Kroplewski @ 2020</h6>
        </Navbar>

        <LoginModal
          register={this.props.register}
          login={this.props.login}
          fblogin={this.props.fblogin}
          valid={this.props.valid}
          err={this.props.err}
          show={this.state.modalShow}
          onHide={() => this.setState({ modalShow: false })}
        />
      </div>
    );
  }
}

export default LandingPage;
