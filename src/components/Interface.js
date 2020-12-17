import React, { Component } from "react";
import Input from "./Input";
import Messages from "./Messages";
import Nav from "./Nav";
import SidebarComp from "./SidebarComp";
import SidebarRight from "./SidebarRight";
import Sidebar from "react-sidebar";
import { Col, Row, Container } from "react-bootstrap";
import { BrowserView, MobileView } from "react-device-detect";
import Dropzone from "react-dropzone";
const audio = new Audio("not.mp3");

export class Interface extends Component {
  constructor() {
    super();
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
    // zjedz w dol przy nowej wiadomosci
    if (this.messagesEnd) {
      this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }
  };
  getRoomsOnAuth(user) {
    //funkcja wywolowyana z komponentu app po zalogowaniu
    const db = this.props.db;
    const inter = this;
    db.collection("rooms")
      .where("users", "array-contains", user.uid) //wyszukanie w bazie danych pokoi ktore zawierają użytkownika
      .get()
      .then((myrooms) => {
        // poaczatkowe wczytanie wszystkich pokoi uzytkownika
        let arr = myrooms.docs.map((doc) => {
          return { roomid: doc.id, roomname: doc.data().roomname };
        });
        inter.setState({ myRooms: arr }); // aktualizacja state z lista pokoi
        inter.subscribe();
      });
    db.collection("rooms")
      .where("users", "array-contains", user.uid)
      .onSnapshot((myrooms) => {
        // subskybcja do pokoi w ktorych sie znajdujemy
        // wykonywane po dodaniu uzytkownika do nowego pokoju
        let arr = myrooms.docs.map((doc) => {
          return { roomid: doc.id, roomname: doc.data().roomname };
        });
        inter.setState({ myRooms: arr });
      });
  }

  subscribetoNew(roomid) {
    //wykonywane tylko gdy uzytkownik utowrzy lub dolaczy do pokoju
    const db = this.props.db;
    let roomname = "room_" + roomid;
    let messdb = db.collection("rooms").doc(roomid).collection("messages");
    const inter = this;
    this.setState((prevState) => ({
      // utworzenie lastmessages dla nowo utowrzonego pokoju
      lastmessages: {
        ...prevState.lastmessages,
        [roomid]: { content: "No messages" },
      },
    }));
    messdb
      .orderBy("id", "desc")
      .limit(1)
      .onSnapshot(
        //subskrybcja dla nowo przychodzących wiadomosci w nowym pokoju
        (data) => {
          //wykonowyane po przyjsciu wiadomosci
          if (data.docs.length !== 0) {
            if (data.docs[0].data().pic === true) {
              // jesli wiadmosc jest obrazkiem
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
              // dodanie najnowszej wiadomsoci do lastmessages
              inter.setState((prevState) => ({
                lastmessages: {
                  ...prevState.lastmessages,
                  [roomid]: data.docs[0].data(),
                },
              }));
            }
            if (inter.state[roomname]) {
              //jesli pokoj istnieje w pamieci
              inter.setState({
                [roomname]: inter.state[roomname].concat(data.docs[0].data()), // dodanie do tablicy najnowszej wiadomosci
              });
              inter.scrollToBottom(); //scroll na sam dol
              audio.play(); //dzwiek powiadomienia
            } else {
              //jesli w pokoju nie bylo wczesniejszych wiadomosci
              inter.setState({ [roomname]: [data.docs[0].data()] });
            }
          }
        },
        (err) => {
          console.error(err);
        }
      );
  }

  subscribe() {
    // wykonywana po wczytaniu pokoi uzytknownika
    const db = this.props.db;
    const inter = this;
    this.state.myRooms.forEach((room) => {
      // dla kazdego pokoju wykonujemy ta funkcje
      let messdb = db.collection("rooms").doc(room.roomid).collection("messages");
      let roomname = "room_" + room.roomid;
      inter.setState({ subscribed: inter.state.subscribed.concat(roomname) });
      messdb
        .orderBy("id", "desc")
        .limit(1)
        .onSnapshot(
          // subskrybcja do nowo przychodzacych wiadomsci w tym pokoju
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
  componentDidMount() {}
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
          {/* wysuwany z boku panel na telefonach */}
          <Sidebar
            sidebar={
              <div className="container">
                <SidebarComp // komponent z sidebarem
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

        <Nav // nawigacja strony
          username={this.props.username}
          logout={this.props.logout}
          sidebar={() => {
            this.setState({ sidebarOpen: true });
          }}
        />
        <Container id="interface">
          {/* wersja na komputer */}
          <BrowserView>
            <Row>
              <Col style={{ maxWidth: "20vw" }} id="side">
                <SidebarComp // komponent z sidebarem
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
                  noKeyboard={true}
                  onDrop={(acceptedFiles) => {
                    this.refs.input.uploadFile(acceptedFiles[0]); // wysylanie zdjec poprzez dropzone
                    console.log(acceptedFiles);
                    // console.log(this.refs.input);
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />

                      <div id="messages" className="container">
                        {this.state.finished === true && (
                          //jesli pokoje i wiadomosci zostaly wczytane
                          <Messages // komponent zawierajacy wszystkie wiadomosci
                            saveMessages={(roomname, roomcontent) => {
                              this.setState({
                                ["room_" + roomname]: roomcontent,
                              });
                            }}
                            messages={
                              this.state["room_" + this.state.currentRoom] //adres w state zawierajacy wiadomosci danego pokoju
                            }
                            key={this.state.currentRoom}
                            db={this.props.db}
                            room={this.state.currentRoom}
                            scroll={this.scrollToBottom}
                            username={this.props.username}
                          />
                        )}
                        <div // ukryty div uzywany do scrollowania na spod
                          style={{ float: "left", clear: "both" }}
                          ref={(el) => {
                            this.messagesEnd = el;
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </Dropzone>
                <Input // komponent do wpisywania wiadomosci
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
          {/* wersja na telefon */}
          <MobileView>
            <div id="messages">
              {this.state.finished === true && (
                <Messages // komponent z wiadomosciami
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
            <Input // komponent do wpisywania wiadomosci
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
