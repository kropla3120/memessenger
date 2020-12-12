import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Image from "react-bootstrap/Image";

export class FullView extends Component {
  render() {
    return (
      <div>
        <Modal
          id="modal"
          show={this.props.show}
          onHide={this.props.onHide}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          dialogClassName={"fullview"}
        >
          <Image id="fullpic" src={this.props.pic} fluid />
        </Modal>
      </div>
    );
  }
}

export default FullView;
