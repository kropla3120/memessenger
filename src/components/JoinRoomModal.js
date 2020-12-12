import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import firebase from "firebase/app";
import "firebase/firestore";

export class Joiner extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      invalid: false,
      err: "",
    };
    this.Join = this.Join.bind(this);
  }
  componentDidMount() {}
  Join() {
    let thisc = this;
    const db = this.props.db;
    db.collection("rooms") // dodanie uzytkownika do pokoju w bazie danych
      .doc(this.state.id)
      .update({
        users: firebase.firestore.FieldValue.arrayUnion(thisc.props.id),
      })
      .then(() => {
        thisc.props.setActive(thisc.state.id);
        thisc.props.onHide();
        thisc.props.update(thisc.state.id);
      })
      .catch((err) => {
        thisc.setState({
          invalid: true,
          err: "Group with this ID doesn't exist",
        });
      });
  }

  render() {
    return (
      <div>
        <Modal
          show={this.props.show}
          onHide={this.props.onHide}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Join a group
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.invalid && (
              <Alert variant="danger">{this.state.err}</Alert>
            )}
            <h4>ID of the group:</h4>
            <Form>
              <Form.Control
                id="myInput"
                onChange={(e) => this.setState({ id: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    this.Join();
                  }
                }}
                type="text"
                placeholder=""
              />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.onHide}>Close</Button>
            <Button onClick={this.Join}>Join</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default React.memo(Joiner);
