import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import shortid from "shortid";

export class Creater extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      newroomid: "",
      created: false,
    };
    this.Create = this.Create.bind(this);
  }
  Create() {
    const db = this.props.db;
    let roomid = shortid.generate();
    db.collection("rooms")
      .doc(roomid)
      .set({ roomname: this.state.name, users: [this.props.id] })
      .then((docRef) => {
        this.props.onHide();
        this.props.setActive(roomid);
        this.props.update(roomid);
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
              Create a group
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Name of the group:</h4>
            <Form>
              <Form.Control
                id="myInput"
                onChange={(e) => this.setState({ name: e.target.value })}
                onKeyDown={(e)=>{if(e.key==='Enter'){
                  e.preventDefault();
                  this.Create()
                }}}
                type="text"
                placeholder=""
              />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.onHide}>Close</Button>
            <Button onClick={this.Create}>Create</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default React.memo(Creater);
