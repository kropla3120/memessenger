import React, { Component } from "react";
import Input from "./Input";
import Messages from "./Messages";
import Nav from "./Nav";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import SidebarComp from "./SidebarComp";
import SidebarRight from "./SidebarRight";
import Sidebar from "react-sidebar";
import { BrowserView, MobileView } from "react-device-detect";
import Dropzone from "react-dropzone";
const audio = new Audio("not.mp3");

// const NoInputLayout = ({ previews, submitButton, dropzoneProps, files }) => {
//   return (
//     <div {...dropzoneProps}>
//       {files.length === 0 && (
//         <span
//           className={defaultClassNames.inputLabel}
//           style={{ cursor: "unset" }}
//         >
//           Only Drop Files (No Input)
//         </span>
//       )}

//       {previews}

//       {files.length > 0 && submitButton}
//     </div>
//   );
// };

export class Interface extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: "",
      currentRoom: "default",
      myRooms: "",
      subscribed: [],
      lastmessages: {},
      finished: false,
      sidebarOpen: false,
    };
    this.setRoom = this.setRoom.bind(this);
    this.update = this.update.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.subscribetoNew = this.subscribetoNew.bind(this);
  }

  scrollToBottom = () => {
    if (this.messagesEnd) {
      this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }
  };
  getRoomsOnAuth(user) {
    const db = this.props.db;
    const inter = this;
    db.collection("rooms")
      .where("users", "array-contains", user.uid)
      .get()
      .then((myrooms) => {
        let arr = myrooms.docs.map((doc) => {
          return { roomid: doc.id, roomname: doc.data().roomname };
        });
        inter.setState({ myRooms: arr });
        inter.subscribe();
      });
    db.collection("rooms")
      .where("users", "array-contains", user.uid)
      .onSnapshot((myrooms) => {
        let arr = myrooms.docs.map((doc) => {
          return { roomid: doc.id, roomname: doc.data().roomname };
        });
        inter.setState({ myRooms: arr });
      });
  }

  subscribetoNew(roomid) {
    const db = this.props.db;
    let roomname = "room_" + roomid;
    let messdb = db.collection("rooms").doc(roomid).collection("messages");
    const inter = this;
    this.setState((prevState) => ({
      lastmessages: {
        ...prevState.lastmessages,
        [roomid]: { content: "No messages" },
      },
    }));
    messdb
      .orderBy("id", "desc")
      .limit(1)
      .onSnapshot(
        (data) => {
          if (data.docs.length !== 0) {
            if (data.docs[0].data().pic === true) {
              inter.setState((prevState) => ({
                lastmessages: {
                  ...prevState.lastmessages,
                  [roomid]: {
                    content: "Picture",
                    author: data.docs[0].data().author,
                  },
                },
              }));
            } else {
              inter.setState((prevState) => ({
                lastmessages: {
                  ...prevState.lastmessages,
                  [roomid]: data.docs[0].data(),
                },
              }));
            }
            if (inter.state[roomname]) {
              inter.setState({
                [roomname]: inter.state[roomname].concat(data.docs[0].data()),
              });
              inter.scrollToBottom();
              audio.play();
            } else {
              inter.setState({ [roomname]: [data.docs[0].data()] });
            }
          }
          // else{
          //   inter.setState((prevState) => ({
          //     lastmessages: {
          //       ...prevState.lastmessages,
          //       [roomid]: {content: "No messages"},
          //     },
          //   }));
          // }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  subscribe() {
    const db = this.props.db;
    const inter = this;
    this.state.myRooms.forEach((room) => {
      let messdb = db
        .collection("rooms")
        .doc(room.roomid)
        .collection("messages");
      let roomname = "room_" + room.roomid;
      inter.setState({ subscribed: inter.state.subscribed.concat(roomname) });
      messdb
        .orderBy("id", "desc")
        .limit(1)
        .onSnapshot(
          (data) => {
            if (data.docs.length !== 0) {
              if (data.docs[0].data().pic === true) {
                inter.setState((prevState) => ({
                  lastmessages: {
                    ...prevState.lastmessages,
                    [room.roomid]: {
                      content: "Picture",
                      author: data.docs[0].data().author,
                    },
                  },
                }));
              } else {
                inter.setState((prevState) => ({
                  lastmessages: {
                    ...prevState.lastmessages,
                    [room.roomid]: data.docs[0].data(),
                  },
                }));
              }
              if (inter.state[roomname]) {
                inter.setState({
                  [roomname]: inter.state[roomname].concat(data.docs[0].data()),
                });
                audio.play();
                inter.scrollToBottom();
              } else {
                inter.setState({ [roomname]: [data.docs[0].data()] });
              }
            }
          },
          (err) => {
            console.log(err);
          }
        );
    });
    this.setState({ finished: true });
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }
  componentDidMount() {
    console.log(this.refs.input);
  }
  update() {
    this.setState({ ["room_" + this.state.currentRoom]: [] });
  }

  setRoom(e) {
    this.setState({ currentRoom: e });
    // console.log(e)
  }
  render() {
    return (
      <div>
        <MobileView>
          <Sidebar
            sidebar={
              <div className="container">
                <SidebarComp
                  logout={this.props.logout}
                  username={this.props.username}
                  lastmessages={this.state.lastmessages}
                  update={this.subscribetoNew}
                  id={this.props.id}
                  db={this.props.db}
                  setActive={(room) => this.setState({ currentRoom: room })}
                  setRoom={this.setRoom}
                  rooms={this.state.myRooms}
                  activeroom={this.state.currentRoom}
                />
              </div>
            }
            open={this.state.sidebarOpen}
            onSetOpen={(bool) => this.setState({ sidebarOpen: false })}
            styles={{ sidebar: { background: "#18191a" } }}
          >
            idk
          </Sidebar>
        </MobileView>

        <Nav
          username={this.props.username}
          logout={this.props.logout}
          sidebar={() => {
            this.setState({ sidebarOpen: true });
          }}
        />
        <Container id="interface">
          <BrowserView>
            <Row>
              <Col style={{ maxWidth: "20vw" }} id="side">
                <SidebarComp
                  lastmessages={this.state.lastmessages}
                  update={this.subscribetoNew}
                  id={this.props.id}
                  db={this.props.db}
                  setActive={(room) => this.setState({ currentRoom: room })}
                  setRoom={this.setRoom}
                  rooms={this.state.myRooms}
                  activeroom={this.state.currentRoom}
                />
              </Col>
              <Col xs={8}>
                <Dropzone
                  noClick={true}
                  // noKeyboard={true}
                  onDrop={(acceptedFiles) => {
                    this.refs.input.uploadFile(acceptedFiles[0]);
                    console.log(acceptedFiles);
                    // console.log(this.refs.input);
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />

                      <div id="messages" className="container">
                        {this.state.finished === true && (
                          <Messages
                            saveMessages={(roomname, roomcontent) => {
                              this.setState({
                                ["room_" + roomname]: roomcontent,
                              });
                            }}
                            messages={
                              this.state["room_" + this.state.currentRoom]
                            }
                            key={this.state.currentRoom}
                            db={this.props.db}
                            room={this.state.currentRoom}
                            scroll={this.scrollToBottom}
                            username={this.props.username}
                          />
                        )}
                        <div
                          style={{ float: "left", clear: "both" }}
                          ref={(el) => {
                            this.messagesEnd = el;
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </Dropzone>
                <Input
                  ref="input"
                  userpic={this.props.userpic}
                  storage={this.props.storage}
                  clear={this.update}
                  db={this.props.db}
                  room={this.state.currentRoom}
                  username={this.props.username}
                />
              </Col>
              <Col>
                <SidebarRight />
              </Col>
            </Row>
          </BrowserView>
          <MobileView>
            <div id="messages">
              {this.state.finished === true && (
                <Messages
                  saveMessages={(roomname, roomcontent) => {
                    this.setState({ ["room_" + roomname]: roomcontent });
                  }}
                  messages={this.state["room_" + this.state.currentRoom]}
                  key={this.state.currentRoom}
                  db={this.props.db}
                  room={this.state.currentRoom}
                  scroll={this.scrollToBottom}
                  username={this.props.username}
                />
              )}
              <div
                style={{ float: "left", clear: "both" }}
                ref={(el) => {
                  this.messagesEnd = el;
                }}
              ></div>
            </div>
            <Input
              ref="input"
              userpic={this.props.userpic}
              storage={this.props.storage}
              clear={this.update}
              db={this.props.db}
              room={this.state.currentRoom}
              username={this.props.username}
            />
          </MobileView>
        </Container>
      </div>
    );
  }
}

export default Interface;
