import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Particles from "react-particles-js";

export class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      passwd: "",
      email: "",
      register: "",
      clicked: false,
      error: null,
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    if (this.state.register === true) {
      this.props.register(
        this.state.email,
        this.state.passwd,
        this.state.username
      );
      // this.setState({username:"", passwd:"", email:""})
    } else {
      this.props.login(this.state.email, this.state.passwd);
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
          height={window.innerHeight - 6}
          width={window.innerWidth - 6}
        />
        <div className="row justify-content-md-center">
          <div id="form" className="container">
            <h1 id="header">{this.state.register ? "Sign up" : "Log in"}</h1>
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
                {this.state.register && (
                  <Form.Control
                    id="login"
                    onChange={(e) =>
                      this.setState({ username: e.target.value })
                    }
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
      </div>
    );
  }
}

export default Login;
