import React, { Component } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import ProgressBar from "react-bootstrap/ProgressBar";

export class Input extends Component {
  constructor() {
    super();
    this.state = {
      message: "",
      selectedFile: null,
      loaded: 0,
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    const db = this.props.db;
    var data = {
      content: this.state.message,
      author: this.props.username,
      id: Date.now(),
      pic: false,
      userpic: this.props.userpic,
    };
    var thisc = this;
    if (data.content === "/clear") {
      db.collection("rooms")
        .doc(this.props.room)
        .collection("messages")
        .get()
        .then((col) => {
          col.docs.forEach((doc) => {
            doc.ref.delete();
          });
          thisc.props.clear();
        });
    } else {
      db.collection("rooms")
        .doc(this.props.room)
        .collection("messages")
        .doc("message_" + Date.now())
        .set(data);
    }
    this.setState({ message: "" });
  }

  uploadFile = (file) => {
    this.setState({
      selectedFile: file,
      loaded: 0,
    });
    const db = this.props.db;
    const input = this;
    const storageRef = this.props.storage.ref("content/");
    var filename = Date.now() + file.name;
    var path = storageRef.child(filename);
    var uploadTask = path.put(file);
    uploadTask.on(
      "state_changed",
      function (snapshot) {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        input.setState({ loaded: progress });
      },
      function (error) {
        // Handle unsuccessful uploads
      },
      function () {
        // Handle successful uploads on complete
        input.setState({ selectedFile: null });
        uploadTask.snapshot.ref.getDownloadURL().then(function (url) {
          var picdata = {
            content: url,
            author: input.props.username,
            id: Date.now(),
            pic: true,
            room: input.props.room,
            userpic: input.props.userpic,
          };
          db.collection("rooms")
            .doc(input.props.room)
            .collection("messages")
            .doc("message_" + Date.now())
            .set(picdata);
        });
      }
    );
    // .then((snapshot) => {
    //   path.getDownloadURL().then((url) => {
    //     var picdata = {
    //       content: url,
    //       author: input.props.username,
    //       id: Date.now(),
    //       pic: true,
    //       room: input.props.room,
    //       userpic: this.props.userpic,
    //     };
    //     db.collection("rooms")
    //       .doc(input.props.room)
    //       .collection("messages")
    //       .doc("message_" + Date.now())
    //       .set(picdata);
    //   });
    // });
  };

  componentDidUpdate() {}

  render() {
    if (this.state.selectedFile) {
    }
    return (
      <div id="input" className="container">
        <div className="row justify-content-md-center">
          <InputGroup className="mb-3">
            <FormControl
              onChange={(e) => {
                this.setState({ message: e.target.value });
              }}
              value={this.state.message}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  this.handleClick();
                }
              }}
              onSubmit={this.handleClick}
              placeholder="Input Message"
              type="text"
              id="myInput"
            />
            <InputGroup.Append>
              <input
                type="file"
                name="file"
                id="file"
                className="btn"
                onChange={(event) => {
                  this.uploadFile(event.target.files[0]);
                }}
              />
              <label id="filebtn" className="btn btn-primary" htmlFor="file">
                <ion-icon style={{ marginRight: 0 }} name="image"></ion-icon>
              </label>
              <Button
                style={{ display: "flex", alignItems: "center" }}
                onClick={this.handleClick}
                variant="primary"
              >
                <ion-icon style={{ marginRight: 0 }} name="send"></ion-icon>
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </div>
        <div>
          {this.state.selectedFile && <ProgressBar now={this.state.loaded} />}
        </div>
      </div>
    );
  }
}

export default Input;
