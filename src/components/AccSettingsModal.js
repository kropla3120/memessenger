import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import firebase from 'firebase/app'
import "firebase/auth";


export class AccSettings extends Component {
    constructor(){
      super()
      this.state={
        username: "",
        photoURL: ""
      }
      this.Save = this.Save.bind(this)
    }
    componentDidMount(){
        let app = this
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
            app.setState({username: user.displayName, photoURL: user.photoURL})
        }
    })
}
    Save(){
        let user = firebase.auth().currentUser;
        let app = this
        user.updateProfile({
            displayName: app.state.username
        }).then(()=>{
            app.props.onHide()
        })
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
            Your Account
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
            <Form.Label>
                Username: 
            </Form.Label>
          <Form.Control 
          id="myInput"
          onChange={(e)=>this.setState({username: e.target.value})}
          defaultValue={this.state.username}
          type='text'
          placeholder=''
          />
        </Form>  
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={this.props.onHide}>Close</Button>
        <Button onClick={this.Save}>Save</Button>
      </Modal.Footer>
    </Modal>
            </div>
        )
    }
}

export default AccSettings
