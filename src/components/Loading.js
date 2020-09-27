import React, { Component } from "react";
import Spinner from "react-bootstrap/Spinner";

export class Loading extends Component {
  render() {
    return (
      <div className="row justify-content-md-center">
        <Spinner animation="grow" />
      </div>
    );
  }
}

export default Loading;
