import React, { Component } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import ProgressBar from "react-bootstrap/ProgressBar";

export class Input extends Component {
  constructor() {
    super();
    this.state = {
      message: "", // tresc aktualnej wiadomosci
      selectedFile: null, // zaznaczony plik
      loaded: 0, // progress
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    const db = this.props.db;
    var data = {
      // obiekt wiadomosci
      content: this.state.message,
      author: this.props.username,
      id: Date.now(),
      pic: false,
      userpic: this.props.userpic,
    };
    var thisc = this;
    if (data.content !== "") {
      if (data.content === "/clear") {
        // jesli wpisano /clear wyczysc wiadomosci z bazy danych
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
        db.collection("rooms") // wyslij wiadomosc do bazy danych
          .doc(this.props.room)
          .collection("messages")
          .doc("message_" + Date.now())
          .set(data);
      }
      this.setState({ message: "" });
    }
  }

  uploadFile = (file) => {
    this.setState({
      // aktualizacja state
      selectedFile: file,
      loaded: 0,
    });
    const db = this.props.db;
    const input = this;
    const storageRef = this.props.storage.ref("content/"); // odnosnik do bazy danych
    var filename = Date.now() + file.name;
    var path = storageRef.child(filename);
    var uploadTask = path.put(file);
    uploadTask.on(
      //wysylanie obrazka do chmury
      "state_changed",
      function (snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        input.setState({ loaded: progress }); // aktualizacja progresu
      },
      function (error) {
        // blad w przesylaniu
      },
      function () {
        // przesylanie poprawne
        input.setState({ selectedFile: null });
        uploadTask.snapshot.ref.getDownloadURL().then(function (url) {
          var picdata = {
            // obiekt wiadomosci
            content: url,
            author: input.props.username,
            id: Date.now(),
            pic: true,
            room: input.props.room,
            userpic: input.props.userpic,
          };
          db.collection("rooms") // wstawienie do bazy danych wiadomosci z obrazkiem
            .doc(input.props.room)
            .collection("messages")
            .doc("message_" + Date.now())
            .set(picdata);
        });
      }
    );
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
                this.setState({ message: e.target.value }); //aktualizacja state z trescia wiadomosci
              }}
              value={this.state.message}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  this.handleClick(); // wiadomosc po kliknieciu enter
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
                  this.uploadFile(event.target.files[0]); // funkcja do przeslania pliku
                }}
              />
              <label id="filebtn" className="btn btn-primary" htmlFor="file">
                <ion-icon style={{ marginRight: 0 }} name="image"></ion-icon>
              </label>
              <Button // przycisk send
                style={{ display: "flex", alignItems: "center" }}
                onClick={this.handleClick} // wiadomosc po kliknieciu w przycisk
                variant="primary"
              >
                <ion-icon style={{ marginRight: 0 }} name="send"></ion-icon>
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </div>
        <div>
          {this.state.selectedFile && <ProgressBar now={this.state.loaded} />}
          {/* jesli jest plik pokaz progres */}
        </div>
      </div>
    );
  }
}

export default Input;
