import React, { Component } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "react-bootstrap";
import Login from "./components/Login";
import Interface from "./components/Interface";
import { isMobile } from "react-device-detect";

const firebaseConfig = {
  apiKey: "AIzaSyBX-Yk-BKl0TsHjkTgQo2GeM9cl-4H_IbQ",
  authDomain: "memessenger-578e5.firebaseapp.com",
  databaseURL: "https://memessenger-578e5.firebaseio.com",
  projectId: "memessenger-578e5",
  storageBucket: "memessenger-578e5.appspot.com",
  messagingSenderId: "1078024062877",
  appId: "1:1078024062877:web:4e39f8cec60aba90cad174",
};
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var storage = firebase.storage();
var provider = new firebase.auth.FacebookAuthProvider();

class App extends Component {
  constructor() {
    super();
    this.state = {
      userid: "",
      islogged: undefined,
      username: "",
      valid: true,
      error: "",
      userpic: "",
      connected: true,
      register: false,
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleFbLogin = this.handleFbLogin.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentWillUnmount() {}

  logout() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("signed out");
      })
      .catch(function (error) {
        // An error happened.
      });
  }
  handleLogin(email, password) {
    let app = this;
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(function () {
        return firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .catch(function (error) {
            app.setState({ valid: false, error: error.message });
          });
      });
  }
  handleRegister(email, password, usernameinput) {
    let app = this;
    this.setState({ register: true });
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((e) => {
        if (e.user) {
          db.collection("rooms")
            .doc("default")
            .update({
              users: firebase.firestore.FieldValue.arrayUnion(e.user.uid),
            });
          e.user.updateProfile({ displayName: usernameinput });
          sessionStorage.setItem("islogged", true);
          app.setState({
            islogged: true,
            username: usernameinput,
            userid: e.user.uid,
            userpic: e.user.photoURL,
          });
          app.refs.interface.getRoomsOnAuth(e.user);
        } else {
        }
      })
      .catch(function (error) {
        app.setState({ valid: false, error: error.message });
      });
  }
  handleFbLogin() {
    const app = this;
    let fbauth;
    if (isMobile) {
      fbauth = firebase.auth().signInWithRedirect(provider);
    } else {
      fbauth = firebase.auth().signInWithPopup(provider);
    }
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(function () {
        return fbauth
          .then(function (user) {
            sessionStorage.setItem("islogged", true);
            app.setState({
              islogged: true,
              username: user.displayName,
              id: user.uid,
              userpic: user.photoURL,
            });
          })
          .catch(function (error) {
            app.setState({ valid: false, error: error.message });
            console.log(error);
          });
      });
  }

  componentDidMount() {
    let app = this;
    // console.log(this.refs.interface);
    firebase.auth().onAuthStateChanged((user) => {
      if (this.state.register) {
      } else {
        if (user) {
          sessionStorage.setItem("islogged", true);
          app.setState({
            islogged: true,
            username: user.displayName,
            userid: user.uid,
            userpic: user.photoURL,
          });
          app.refs.interface.getRoomsOnAuth(user);
        } else {
          sessionStorage.setItem("islogged", false);
          app.setState({ islogged: false });
        }
      }
    });
  }

  render() {
    let islogged = sessionStorage.getItem("islogged");
    return (
      <div>
        {islogged === "true" ? (
          <Interface
            ref="interface"
            userpic={this.state.userpic}
            storage={storage}
            db={db}
            id={this.state.userid}
            logout={this.logout}
            username={this.state.username}
          />
        ) : (
          <Login
            fblogin={this.handleFbLogin}
            err={this.state.error}
            valid={this.state.valid}
            connected={this.state.connected}
            login={this.handleLogin}
            register={this.handleRegister}
          />
        )}
      </div>
    );
  }
}

export default App;
