import React, { Component } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Loading from "./Loading";
import Toast from "react-bootstrap/Toast";
import firebase from "firebase/app";

export class ListRooms extends Component {
  constructor() {
    super();
    this.delete = this.delete.bind(this);
  }
  delete() {
    let app = this;
    const db = this.props.db;
    db.collection("rooms") // usuniecie uzytkownia z pokoju w bazie danych
      .doc(this.props.activeroom)
      .update({
        users: firebase.firestore.FieldValue.arrayRemove(this.props.id),
      })
      .then(() => {
        app.props.setRoom("default");
      });
  }
  componentDidUpdate() {}
  render() {
    const lastmessages = this.props.lastmessages;
    var table = this.props.rooms;
    if (table.length > 0) {
      //jesli ostatnia wiadomosc zostanie zaladowana
      return (
        <div>
          <ListGroup id="grupy">
            {table.map((room) => {
              return (
                <Toast
                  id={room.roomid}
                  key={room.roomid}
                  className="group"
                  onClick={() => {
                    this.props.setRoom(room.roomid);
                  }}
                  style={{
                    backgroundColor:
                      room.roomid === this.props.activeroom //aktywny pokoj na niebiesko
                        ? "#007bff"
                        : "#242526",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                  }}
                >
                  <Toast.Header
                    closeButton={false}
                    style={{
                      backgroundColor:
                        room.roomid === this.props.activeroom
                          ? "#007bff"
                          : "#242526",
                      color: "white",
                      borderBottom: "none",
                    }}
                  >
                    <h5 style={{ margin: "5px" }} className="mr-auto">
                      {room.roomname}
                    </h5>
                    {room.roomid === this.props.activeroom && ( //aktywny pokoj ma przycisk do wyjscia
                      <Button variant="danger" onClick={this.delete}>
                        Leave
                      </Button>
                    )}
                  </Toast.Header>
                  <Toast.Body
                    style={{
                      backgroundColor: "#545b62",
                      borderRadius: "0.4rem",
                    }}
                  >
                    {lastmessages[room.roomid] ? (
                      lastmessages[room.roomid].content +
                      " - " +
                      lastmessages[room.roomid].author
                    ) : (
                      <Loading />
                    )}
                  </Toast.Body>
                </Toast>
              );
            })}
          </ListGroup>
        </div>
      );
    } else return <Loading />; //spinner jesli nie wczytano
  }
}

export default ListRooms;
