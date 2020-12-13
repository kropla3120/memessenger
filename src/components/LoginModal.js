import React, { Component } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";

export class LoginModal extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      passwd: "",
      email: "",
      register: false,
      clicked: false,
      error: null,
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    // przekazanie wartosci wyzej
    if (this.state.register === true) {
      this.props.register(this.state.email, this.state.passwd, this.state.username);
      // this.setState({username:"", passwd:"", email:""})
    } else {
      this.props.login(this.state.email, this.state.passwd);
    }
  }
  render() {
    return (
      <div>
        <Modal id="modal" show={this.props.show} onHide={this.props.onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered dialogClassName={"fullview"}>
          <div className="row justify-content-md-center">
            <div id="form" className="container">
              <h1 id="header">{this.state.register ? "Sign up" : "Log in"}</h1>
              {/* jesli wystapi blad pokaz alert */}
              {this.props.valid === false && (
                <Alert id="connection" variant="danger">
                  {this.props.err}
                </Alert>
              )}
              <Form>
                <Form.Group>
                  <Form.Control
                    id="login"
                    onChange={(e) => this.setState({ email: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        this.handleClick();
                      }
                    }}
                    type="text"
                    placeholder="Email"
                  />
                  <Form.Control
                    id="login"
                    onChange={(e) => this.setState({ passwd: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        this.handleClick();
                      }
                    }}
                    type="password"
                    placeholder="Password"
                  />
                  {/* jesli rejestracja to dodaj pole do nazwy uzytkonika */}
                  {this.state.register && (
                    <Form.Control
                      id="login"
                      onChange={(e) => this.setState({ username: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          this.handleClick();
                        }
                      }}
                      type="text"
                      placeholder="Username"
                    />
                  )}
                </Form.Group>
                <Button id="sub" variant="primary" onClick={this.handleClick}>
                  {this.state.register ? "Register" : "Login"}
                  {/* renderowanie warunkowe wybor rejestracji lub logowania   */}
                </Button>
                <Button
                  id="sub"
                  variant="primary"
                  onClick={this.props.fblogin}
                  style={{
                    marginTop: "1rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ion-icon name="logo-facebook" size="medium"></ion-icon>
                  Login with Facebook
                </Button>
              </Form>
              {/* renderowanie warunkowe przycisk login lub register */}
              {this.state.register ? (
                <a
                  id="ahref"
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    this.setState({ register: false });
                  }}
                >
                  Log in
                </a>
              ) : (
                <a
                  id="ahref"
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    this.setState({ register: true });
                  }}
                >
                  Sign up
                </a>
              )}
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default LoginModal;
