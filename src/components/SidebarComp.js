import React, { Component, Suspense } from "react";
// import Alert from 'react-bootstrap/Alert'
import Button from "react-bootstrap/Button";
import Loading from './Loading'
import ListRooms from "./ListRooms";
import Card from "react-bootstrap/Card";
import { MobileView } from "react-device-detect";
const Creater = React.lazy(() => import("./CreateRoomModal"));
const Joiner = React.lazy(() => import("./JoinRoomModal"));

export class Sidebar extends Component {
  constructor() {
    super();
    this.state = {
      activeUsers: [],
      showcreate: false,
      showjoin: false,
      online: "",
    };
  }

  render() {
    // let activeuser
    // if(this.state){
    //     activeuser = this.state.activeUsers.map((user)=>{
    //         return(<Alert key={user} style={{backgroundColor: '#545b62'}} variant='secondary'>{user}</Alert>)})
    // }else{
    //     activeuser = <Loading />
    // }
    return (
      <div className="sidebar" style={{ marginTop: "1rem" }}>
        <MobileView>
          <h5>Logged in as: {this.props.username}</h5>
          <Button
            onClick={this.props.logout}
            style={{ width: "100%", marginBottom: "1rem" }}
            variant="primary"
          >
            Logout
          </Button>
        </MobileView>
        <h3>Your chats</h3>
        <ListRooms
          id={this.props.id}
          lastmessages={this.props.lastmessages}
          db={this.props.db}
          rooms={this.props.rooms}
          activeroom={this.props.activeroom}
          setRoom={this.props.setRoom}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "1rem",
          }}
        >
          <Button
            id="joinc"
            onClick={() => {
              this.setState({ showjoin: true });
            }}
          >
            Join
          </Button>
          <Button
            id="joinc"
            onClick={() => {
              this.setState({ showcreate: true });
            }}
          >
            Create
          </Button>
        </div>
        <div style={{ paddingTop: "1rem" }}>
          <h3>Share</h3>
          <Card bg="primary" style={{ color: "white" }}>
            <Card.Header>
              <h5 style={{ marginBottom: 0 }}>
                {" "}
                Chat ID: {this.props.activeroom}{" "}
              </h5>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                Share it with your friends in order for them to join
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
        <Suspense fallback={<Loading/>}>
          <Creater
            update={this.props.update}
            id={this.props.id}
            db={this.props.db}
            show={this.state.showcreate}
            setActive={this.props.setActive}
            onHide={() => this.setState({ showcreate: false })}
          />
        </Suspense>
        <Suspense fallback={<Loading/>}>
          <Joiner
            update={this.props.update}
            id={this.props.id}
            db={this.props.db}
            show={this.state.showjoin}
            setActive={this.props.setActive}
            onHide={() => this.setState({ showjoin: false })}
          />
        </Suspense>
      </div>
    );
  }
}

export default Sidebar;
