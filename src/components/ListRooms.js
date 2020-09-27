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
    db.collection("rooms")
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
      return (
        <div>
          <ListGroup id="grupy">
            {table.map((room) => {
              if (room.roomid === this.props.activeroom) {
                return (
                  <Toast
                    id={room.roomid}
                    key={room.roomid}
                    className="group"
                    onClick={() => {
                      this.props.setRoom(room.roomid);
                    }}
                    style={{
                      backgroundColor: "#007bff",
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                    }}
                  >
                    <Toast.Header
                      closeButton={false}
                      style={{
                        backgroundColor: "#007bff",
                        color: "white",
                        borderBottom: "none",
                      }}
                    >
                      <h5 style={{ margin: "5px" }} className="mr-auto">
                        {room.roomname}
                      </h5>
                      <Button variant="danger" onClick={this.delete}>
                        Leave
                      </Button>
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
              } else
                return (
                  <Toast
                    id={room.roomid}
                    key={room.roomid}
                    className="group"
                    onClick={() => {
                      this.props.setRoom(room.roomid);
                    }}
                    style={{
                      background: "none",
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                    }}
                  >
                    <Toast.Header
                      closeButton={false}
                      style={{
                        backgroundColor: "#242526",
                        color: "white",
                        borderBottom: "none",
                      }}
                    >
                      <h5 style={{ margin: "5px" }} className="mr-auto">
                        {room.roomname}
                      </h5>
                    </Toast.Header>
                    <Toast.Body style={{ backgroundColor: "#545b62" }}>
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
    } else return <Loading />;
  }
}

export default ListRooms;
